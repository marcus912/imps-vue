<template>
  <div class="container font-small">
    <Header :title="title"/>
    <div class="space"></div>
    <div class="row" style="margin-bottom: 5px; margin-left:10px; font-size: 16px;">
      <div class="row" style="margin-bottom:1px;">
        <div style="100%">供應商<span class="space"/>
          <input type="text" class="" style="background-color:#D6D6D6;width: 70%; text-align: left;"
            readonly="readonly" ref="VENDOR_NAME"
            v-model="header.VENDOR_NAME">
        </div>
        <div style="margin-bottom:3px"/>
        <div style="100%">手工單<span class="space"/>
          <input type="text" class="" style="background-color:#D6D6D6;width: 70%; text-align: left;"
            readonly="readonly"
            v-model="header.SHIPMENT_NUM">
        </div>
      </div>
    </div>
    <div class="row">
        <div class="panel panel-primary" style="">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                      <th style="width:8%">#</th>
                      <th style="width:24%">採購單號</th>
                      <th style="">料號/儲位</th>
                      <th style="width:14%" nowrap>倉庫</th>
                      <th style="width:14%" nowrap>應收</th>
                      <th style="width:15%" nowrap>實收</th>
                    </tr>
                </thead>
                <tbody style="overflow-y: scroll;">
                    <tr v-for="(row, index) in lines" v-bind:key="row.SHIPMENT_NUM">
                        <td style="width:8%" class="font-small-xs">{{index+1}}</td>
                        <td class="row-td" style="word-break: normal; width:24%;">
                          <router-link v-bind:to="{ name: 'IMPS03005', params: {header: header, line: row, items: items, item: item, isPO: $data.isPO} }">
                            {{row.PO_NUM}}
                            <br v-show="row.RELEASE_NUM != ''">
                            -{{row.RELEASE_NUM}}
                          </router-link>
                        </td>
                        <td class="row-td font-small-xs">
                          {{row.ITEM_NO}}
                          <br>
                          {{row.STORE_KEEPER}}
                        </td>
                        <td class="row-td" style="width:14%">{{row.SUBINVENTORY}}</td>
                        <td class="right col-md-2" style="width:15%" v-bind:class="{ fontSizeXs: row.RCV_QTY !== undefined && row.RCV_QTY.length > 4 }">{{row.RCV_QTY}}</td>
                        <td class="right col-md-2" style="color:red; width:15%;" v-bind:class="{ fontSizeXs: row.REAL_QTY !== undefined && row.REAL_QTY.length > 4 }">{{row.REAL_QTY}}</td>
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
            :disabled="lines.length === 0">
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
  name: 'IMPS03003_2',
  components: {
    Header
  },
  data () {
    return {
      title: '手工單(非EP)',
      domain: this.$store.state.domain,
      ignoreInsert: '',
      clearTempRecords: false,
      userInfo: this.$store.state.userInfo,
      datetime: '',
      fullName: this.$store.state.userInfo.userName + '/' + this.$store.state.userInfo.realName,
      isPO: this.$route.params.isPO,
      ITEM_NO_CONDITION: this.$route.params.ITEM_NO_CONDITION,
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
        ITEM_NO: '',
        PO_NUM: '',
        RELEASE_NUM: ''
      },
      lines: {},
      items: {},
      item: {}
    }
  },
  computed: {

  },
  methods: {
    validate: function () {
      let flag = true
      for (let i in this.lines) {
        let line = this.lines[i]
        if (line.REAL_QTY === undefined || Number(line.REAL_QTY) === 0) {
          flag = false
          break
        }
      }
      if (flag === true) {
        this.confirm()
      } else {
        this.$Message.error('尚未有收料項目')
      }
    },
    confirm: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03003Confirm', {
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
          console.log(e)
          this.$parent.hideLoader(e)
        })
    },
    getHeaderLines: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03003GetHeaderLines', {
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
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          console.log(e)
          this.$parent.hideLoader(e)
        })
    },
    getPOHeaderLines: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03003GetPOHeaderLines', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.$parent.hideLoader()
          if (data.result === 'Y') {
            this.header = data.header
            this.lines = data.lines
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          console.log(e)
          this.$parent.hideLoader(e)
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
      console.log(this.$data.isPO)
      if (this.$data.isPO === 'Y') {
        this.$router.push({name: 'IMPS03003'})
      } else {
        if (this.$data.items.length === 1) {
          this.$router.push({name: 'IMPS03003'})
        } else {
          this.$router.push({ name: 'IMPS03003_1', params: {items: this.$data.items} })
        }
      }
    },
    getDatetime: function () {
      return new Date().toLocaleTimeString('en-US', {hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'})
    }
  },
  created: function () {
    if (this.$route.params.items === undefined) {
      this.$router.push({ name: 'IMPS03003', params: {} })
    } else {
      this.$data.ignoreInsert = this.$route.params.ignoreInsert
      if (this.$data.ignoreInsert) {
        this.$data.header = this.$route.params.header
      }
      this.$data.item = this.$route.params.item
      this.$data.items = this.$route.params.items
      this.$data.header.VENDOR_NAME = this.$route.params.item.VENDOR_NAME

      if (this.$route.params.isPO === 'Y') {
        this.$data.header.PO_NUM = this.$route.params.PO_NUM
        this.$data.header.RELEASE_NUM = this.$route.params.RELEASE_NUM
        this.getPOHeaderLines()
      } else {
        this.$data.header.ITEM_NO = this.$route.params.item.ITEM_NO
        this.getHeaderLines()
      }
    }

    setInterval(() => {
      this.datetime = this.getDatetime()
    }, 1000)
  },
  beforeDestroy: function () {
    console.log('IMPS03003_2 beforeDestroy')
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
