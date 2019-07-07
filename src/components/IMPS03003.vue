<template>
  <div class="container ">
    <Header :title="title"/>
    <form>
      <div style="margin-top:30px;"></div>
        <br>
      <br>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon" style="width:110px;">料號</span>
        <input class="form-control" style="font-size:20px;" placeholder="" @keydown.enter="$refs.PO_NUM.focus"
          @input="ITEM_NO = $event.target.value.toUpperCase().replace(/[^A-Za-z0-9-/]/gi,'')"
          type="text" v-model="ITEM_NO" ref="ITEM_NO" data-vv-name="料號"
          v-validate="PO_NUM!=='' || RELEASE_NUM!==''? '' : 'required|min:3'">
      </div>
      <span class="alert alert-danger" v-show="errors.has('料號')">{{ errors.first('料號') }}</span>
      <br>
      <br>
      <br>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon" style="width:110px;">採購單號</span>
        <input class="form-control" style="font-size:20px;" placeholder="" @keydown.enter="$refs.RELEASE_NUM.focus"
          type="number" v-model.number="PO_NUM" ref="PO_NUM" data-vv-name="採購單號"
          v-validate="RELEASE_NUM===''? '' : 'required'">
      </div>
      <span class="alert alert-danger" v-show="errors.has('採購單號')">{{ errors.first('採購單號') }}</span>
      <br>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon" style="width:110px;">發放號</span>
        <input class="form-control" style="font-size:20px;" placeholder=""
          type="number" v-model.number="RELEASE_NUM" ref="RELEASE_NUM">
      </div>

      <div style="margin-bottom:60px;"></div>

      <div class="form-group row" >
        <div class="col-sm-10" align="center">
          <span style="margin:10px;">
            <button class="font-big btn btn-success" type="button" @click="validate()"
              style="width:150px; height:44px; font-size:20px;">
              下一步
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
  name: 'IMPS03003',
  components: {
    Header
  },
  data () {
    return {
      title: '手工單(非EP)',
      ITEM_NO: '',
      PO_NUM: '',
      RELEASE_NUM: '',
      domain: this.$store.state.domain
    }
  },
  computed: {

  },
  created: function () {

  },
  methods: {
    submit: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=imps03003GetItems', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            if (data.isPO === 'Y') {
              this.$router.push({ name: 'IMPS03003_2', params: {items: data.items, item: data.items[0], isPO: data.isPO, PO_NUM: data.PO_NUM, RELEASE_NUM: data.RELEASE_NUM, ITEM_NO_CONDITION: this.$data.ITEM_NO} })
            } else {
              if (data.items.length === 1) {
                this.$router.push({ name: 'IMPS03003_2', params: {items: data.items, item: data.items[0]} })
              } else {
                this.$router.push({ name: 'IMPS03003_1', params: {items: data.items} })
              }
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
    validate: function () {
      var vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          vm.submit()
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
