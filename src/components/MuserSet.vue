<template>
  <div class="container ">
    <Header :title="title"/>
    <form>
      <div class="space"/>
      <div style="margin-top:20px;"></div>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon" style="width:110px;">帳號</span>
        <input class="form-control" type="text" v-model="name" readonly="readonly">
      </div>
      <br/>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon " style="width:110px;">原密碼</span>
        <input class="required form-control" placeholder="原密碼"
          ref="password" @keydown.enter="$refs.newPassword.focus"
          type="password" v-model="password" style="background-color: #FFFF99"
          v-validate="'required|min:4'" data-vv-name="原密碼">
      </div>
      <span class="alert alert-danger" v-show="hasErrors && errors.has('原密碼')">{{ errors.first('原密碼') }}</span>
      <br/>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon " style="width:110px;">新密碼</span>
        <input class="required form-control" placeholder="新密碼"
          ref="newPassword" @keydown.enter="$refs.newPasswordC.focus"
          type="password" v-model="newPassword" style="background-color: #FFFF99"
          v-validate="'required|min:4'" data-vv-name="新密碼">
      </div>
      <span class="alert alert-danger" v-show="hasErrors && errors.has('新密碼')">{{ errors.first('新密碼') }}</span>
      <br/>
      <div class="input-group input-group-lg col-lg-offset-4">
        <span class="input-group-addon " style="width:110px;">密碼確認</span>
        <input class=" required form-control" placeholder="新密碼確認"
          ref="newPasswordC" @keydown.enter="$refs.indexPage.focus"
          type="password" v-model="newPasswordC" style="background-color: #FFFF99"
          v-validate="'required|min:4'" data-vv-name="密碼確認">
      </div>
      <span class="alert alert-danger" v-show="hasErrors && errors.has('密碼確認')">{{ errors.first('密碼確認') }}</span>
      <br/>
      <div style="margin-top:20px;"></div>
      <div class="form-group row">
        <div class="" align="center" nowrap style="margin-top:20px;">
          <span style="margin:5px;">
            <button class="btn btn-danger" type="button"
              style="width:120px; height:50px; font-size:20px;" @click="clear()">
              清空
            </button>
          </span>
          <span style="margin:5px;">
            <button class="btn btn-success" type="button"
              style="width:120px; height:50px; font-size:20px;" @click="validate()">
              確認
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
  name: 'MuserSet',
  components: {
    Header
  },
  data () {
    return {
      title: '密碼修改',
      domain: this.$store.state.domain,
      name: this.$store.state.userInfo.userName + '/' + this.$store.state.userInfo.realName,
      password: '',
      newPassword: '',
      newPasswordC: '',
      userInfo: this.$store.state.userInfo,
      indexPage: this.$store.state.userInfo.indexPage,
      progList: [],
      hasErrors: false
    }
  },
  computed: {

  },
  created: function () {
    this.getProgList()
  },
  methods: {
    update: function () {
      this.$parent.showLoader()
      this.errors.clear()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=userSetupUpdate', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.$Message.info(data.msg)
            this.password = ''
            this.newPassword = ''
            this.newPasswordC = ''
            this.hasErrors = false
          } else {
            this.$Message.error(data.errMsg)
          }
        })
        .catch(e => {
          this.$parent.hideLoader(e)
          console.log(e)
        })
    },
    getProgList: function () {
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=userSetupGetProgList', {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          this.progList = data
          this.indexPage = this.$store.state.userInfo.indexPage
        })
        .catch(e => {
          this.$parent.hideLoader()
          console.log(e)
        })
    },
    clear: function () {
      this.password = ''
      this.newPassword = ''
      this.newPasswordC = ''
      this.hasErrors = false
    },
    validate: function () {
      var vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.newPassword !== this.newPasswordC) {
            this.$Message.error('密碼不相符')
          } else {
            vm.update()
          }
        }
        vm.$data.hasErrors = this.errors.any()
      })
    }
  }
}
</script>
<style scoped>

</style>
