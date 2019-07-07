<template>
  <div class="container">
    <Header :title="title"/>
    <form>
      <div class="space"/>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px; color:red;">ASN號碼</span>
        <input type="text" class="form-control" readonly="readonly" style="color:red;"
          v-model="header.SHIPMENT_NUM">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">供應商</span>
        <input type="text" class="form-control" readonly="readonly"
          v-model="header.VENDOR_NAME">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">儲位</span>
        <input type="text" class="form-control" readonly="readonly"
          v-model="line.STORE_KEEPER">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">採購單號</span>
        <input type="text" class="form-control" readonly="readonly"
          :value="mergePoNum(line)">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">料號</span>
        <input type="text" class="form-control" readonly="readonly"
          v-model="line.ITEM_NO">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">需求量</span>
        <input type="text" class="form-control" readonly="readonly"
          v-model="line.RCV_QTY">
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">倉庫</span>
          <select class="form-control required" v-model="line.SUBINVENTORY" style="background-color: #FFFF99; font-size:17px;"
            ref="line.SUBINVENTORY" @keydown.enter="update()">
            <option v-for="inventory in inventoryList" v-bind:value="inventory.value" v-bind:key="inventory.value">{{ inventory.text }}</option>
          </select>
      </div>
      <div class="input-group">
        <span class="input-group-addon" style="width:100px;">來料數量</span>
        <input type="number" class="form-control required" placeholder="數量" style="background-color: #FFFF99; font-size:17px;"
          v-model.number="line.REAL_QTY" v-validate="'required'" data-vv-name="數量">
      </div>
      <span class="alert alert-danger" v-show="hasErrors && errors.has('數量')">{{ errors.first('數量') }}</span>
      <div class="form-group row">
        <div class="" align="center" nowrap style="margin-top:20px;">
          <span style="margin:5px;">
            <button class="font-big btn btn-danger" type="button"
              style="width:120px; height:50px; font-size:20px;" @click="$router.push({ name: 'IMPS03002', params: {header: header, ignoreInsert: 'Y'} })">
              取消
            </button>
          </span>
          <span style="margin:5px;">
            <button class="font-big btn btn-success" type="button"
              style="width:120px; height:50px; font-size:20px;" @click="showDialog()"
              :disabled="(inventoryList.length === 0 || line.SUBINVENTORY === undefined) && line.RECEIVING_ROUTING_ID !== 2 && line.ITEM_NO.indexOf('P') !== 0">
              修改
            </button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Header from './Header'

export default {
  name: 'IMPS03004',
  components: {
    Header
  },
  data () {
    return {
      title: '來料數量&倉庫修改',
      domain: this.$store.state.domain,
      ignoreInsert: '',
      userInfo: this.$store.state.userInfo,
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
        SHIP_TO_ORG_ID: ''
      },
      line: {
        RCV_UID: '',
        RCV_LINE: '',
        ITEM_NO: '',
        ITEM_REVSION: '',
        STORE_KEEPER: '',
        SUBINVENTORY: '',
        ITEM_ID: '',
        RCV_QTY: '',
        REAL_QTY: '',
        PO_NUM: '',
        RELEASE_NUM: ''
      },
      inventoryList: [],
      hasErrors: false
    }
  },
  computed: {

  },
  methods: {
    modify: function () {
      this.errors.clear()
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03004Modify', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.$Message.info(data.msg)
            this.$router.push({ name: 'IMPS03002', params: {header: this.$data.header, ignoreInsert: 'Y'} })
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          console.log(e)
          this.$parent.hideLoader(e)
        })
    },
    init: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03004Init', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.inventoryList = data.inventoryList
            if (data.defaultInventory !== undefined) {
              this.line.SUBINVENTORY = data.defaultInventory
            }
            if (data.defaulQty !== undefined) {
              this.line.REAL_QTY = data.defaulQty
            }
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
    validate: function () {
      var vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (vm.$data.line.REAL_QTY > vm.$data.line.RCV_QTY) {
            this.$Message.error('來料數量不可大於需求量')
          } else {
            vm.modify()
          }
        }
        vm.$data.hasErrors = this.errors.any()
      })
    },
    showDialog: function () {
      var vm = this
      let inv = vm.line.SUBINVENTORY === undefined ? '' : vm.line.SUBINVENTORY
      let message = {
        title: '修改確認',
        body: '倉庫:' + inv + '  數量:' + vm.line.REAL_QTY
      }

      this.$dialog.confirm(message)
        .then(function () {
          vm.validate()
        })
        .catch(function () {
        })
    }
  },
  created: function () {
    if (this.$route.params.line === undefined) {
      this.$router.push({ name: 'IMPS03002', params: {} })
    } else {
      this.$data.item = this.$route.params.item
      this.$data.items = this.$route.params.items
      this.$data.header = this.$route.params.header
      this.$data.line = this.$route.params.line
      this.init()
    }
  }
}
</script>
<style scoped>
div {
  margin-bottom: 5px;
}
</style>
