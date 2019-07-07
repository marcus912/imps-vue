<template>
  <div class="container font-small">
    <Header :title="title"/>
    <div class="space"></div>
    <div class="row" style="margin-bottom: 5px; margin-left:10px; font-size: 16px;">
      <div class="row" style="margin-bottom:5px;">
        <div >ASN號碼
          <input type="text" class="required" size="18" ref="SHIPMENT_NUM"
            @input="header.SHIPMENT_NUM= $event.target.value.toUpperCase().replace(/[^A-Za-z0-9-/]/gi,'')"
            v-on:keyup.8="header.SHIPMENT_NUM = ''"
            v-on:keyup.46="header.SHIPMENT_NUM = ''"
            :readonly="lines.length > 0"
            maxlength="13"
            v-model="header.SHIPMENT_NUM"
            v-validate="'required'" data-vv-name="ASN號碼">
        </div>
      </div>
      <div class="row" style="margin-bottom:1px;">
        <div >供應商<span class="space"/><span class="space-xs"/><span class="space-xs"/>
          <input type="text" class="" style="background-color:#D6D6D6;width: 80px; text-align: left;"
            readonly="readonly"
            v-model="header.VENDOR_NAME">
          <span class="space"/>
          儲位<span class="space"/>
          <input type="text" class="" style="background-color:#D6D6D6;width: 85px; text-align: left;"
            readonly="readonly"
            v-model="header.STORE_KEEPER">
        </div>
      </div>
    </div>
    <div class="row">
        <div class="panel panel-primary">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                      <th style="width:8%">#</th>
                      <th style="width:24%">採購單號</th>
                      <th style="">料號</th>
                      <th style="width:14%" nowrap>倉庫</th>
                      <th style="width:15%" nowrap>應收</th>
                      <th style="width:15%" nowrap>實收</th>
                    </tr>
                </thead>
                <tbody style="overflow-y: scroll;">
                    <tr v-for="(row, index) in lines" v-bind:key="row.SHIPMENT_NUM">
                      <td style="width:8%" class="font-small-xs">{{index+1}}</td>
                      <td class="row-td" style="word-break: normal; width:24%;">
                        <router-link v-if="epMsg === ''" v-bind:to="{ name: 'IMPS03004', params:{header: header, line: row} }">
                          {{row.PO_NUM}}
                          <br/>
                          -{{row.RELEASE_NUM}}
                        </router-link>
                        <span v-if="epMsg !== ''">
                          {{row.PO_NUM}}
                          <br/>
                          -{{row.RELEASE_NUM}}
                        </span>
                      </td>
                      <td class="row-td">{{row.ITEM_NO}}</td>
                      <td class="row-td" style="width:14%">{{row.SUBINVENTORY}}</td>
                      <td class="right col-md-2" style="width:15%" v-bind:class="{ fontSizeXs: row.RCV_QTY !== undefined && row.RCV_QTY.length > 4 }">
                        {{row.RCV_QTY}}
                      </td>
                      <td class="right col-md-2" style="width:15%;" v-bind:class="{ red: row.REAL_QTY !== row.RCV_QTY, fontSizeXs: row.REAL_QTY !== undefined && row.REAL_QTY.length > 4 }">
                        {{row.REAL_QTY}}
                      </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row" style="margin-bottom: 8px; margin-left:10px;">
      <div class="row">
        收料時間<span class="space"/>
          <input type="text" style="background-color:#D6D6D6;width: 65px; text-align: left;"
            v-model="datetime" readonly="readonly">
        <span class="space"/>
        收料員<span class="space"/>
          <input type="text" style="background-color:#D6D6D6;width: 95px; text-align: left;"
            v-model="fullName" readonly="readonly">
      </div>
    </div>
    <div class="form-group row" style="margin-bottom:10px;">
      <div class="" align="center" nowrap>
        <span style="margin:5px;">
          <button class="font-big btn btn-danger" type="button"
            style="width:120px; height:50px; font-weight:bold; font-size:20px;" v-confirm="{ok: returnToLastPage, message: '是否返回?'}">
            返回
          </button>
        </span>
        <span style="margin:5px;">
          <button class="font-big btn btn-success" type="button"
            style="width:120px; height:50px; font-weight:bold; font-size:20px;" v-confirm="{ok: validate, message: '確定收料數量無誤?'}"
            :disabled="lines.length === 0 || epMsg !== ''">
            確認收料
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header'
export default {
  name: 'IMPS03002',
  components: {
    Header
  },
  data () {
    return {
      title: 'ASN號碼(EP)',
      domain: this.$store.state.domain,
      ignoreInsert: '',
      clearTempRecords: '',
      userInfo: this.$store.state.userInfo,
      datetime: '',
      fullName: this.$store.state.userInfo.userName + '/' + this.$store.state.userInfo.realName,
      epMsg: '',
      header: {
        RCV_UID: '',
        VENDOR_NUM: '',
        VENDOR_NAME: '',
        VENDOR_ID: '',
        VENDOR_SITE_CODE: '',
        VENDOR_SITE_ID: '',
        SHIPMENT_NUM: '',
        SHIPMENT_HEADER_ID: '',
        PAY_ON_CODE: '',
        SHIP_TO_ORG_ID: '',
        STORE_KEEPER: ''
      },
      lines: []
    }
  },
  computed: {

  },
  methods: {
    validate: function () {
      let flag = true
      for (let i in this.lines) {
        let line = this.lines[i]
        if (line.RECEIVING_ROUTING_ID !== 2 && line.ITEM_NO.indexOf('P') !== 0 && line.SUBINVENTORY === undefined) {
          flag = false
          break
        }
      }
      if (flag === true) {
        this.confirm()
      } else {
        this.$Message.error('請確認倉庫')
      }
    },
    confirm: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03002Confirm', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.$Message.info(data.msg)
            this.clearTempRecords = false
            this.$router.push({ name: 'IMPS03001', params: {} })
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          this.$parent.hideLoader(e)
          console.log(e)
        })
    },
    getHeaderLines: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03002GetHeaderLines', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.header = data.header
            this.lines = data.lines
            if (data.epMsg !== undefined) {
              this.epMsg = data.epMsg
              this.$Message.error(this.epMsg)
            }
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          this.$parent.hideLoader(e)
          console.log(e)
        })
    },
    mergePoNum: function (row) {
      return row.PO_NUM + '-' + row.RELEASE_NUM
    },
    clearRecords: function () {
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=clearTempRecords', {
        method: 'POST',
        body: JSON.stringify(this.$data.header)
      })
    },
    returnToLastPage: function () {
      this.clearRecords()
      this.$router.push({name: 'IMPS03001'})
    },
    getDatetime: function () {
      return new Date().toLocaleTimeString('en-US', {hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'})
    }
  },
  watch: {
    'header.SHIPMENT_NUM': function (val) {
      if (val.length === 10) {
        if (/^[0-9]/.test(val)) {
          this.header.SHIPMENT_NUM = 'SYD' + val
        }
      } else if (val.length === 13) {
        if (val.indexOf('SYD') >= 0) {
          this.getHeaderLines()
        }
      }
    }
  },
  created: function () {
    this.$data.ignoreInsert = this.$route.params.ignoreInsert
    if (this.$route.params.header !== undefined && this.$route.params.header.SHIPMENT_NUM) {
      this.$data.header.SHIPMENT_NUM = this.$route.params.header.SHIPMENT_NUM
    }

    setInterval(() => {
      this.datetime = this.getDatetime()
    }, 1000)
  },
  mounted: function () {
    if (this.$data.ignoreInsert !== 'Y') {
      this.$refs.SHIPMENT_NUM.focus()
    }
  },
  beforeDestroy: function () {
    console.log('IMPS03002 beforeDestroy')
    if (this.clearTempRecords) {
      this.clearRecords()
    }
  }
}
</script>
<style scoped>
.row-td {
  word-break: break-all
}

.red {
  color: red
}

table tbody {
  display:block;
  max-height:235px;
  overflow-y:scroll;
}

table thead, table tbody tr {
  display:table;
  width:100%;
  table-layout:fixed;
}

.fontSizeXs {
  font-size: 12px;
}
</style>
