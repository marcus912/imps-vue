<template>
  <div class="container ">
    <Header :title="title"/>
    <form>
      <div style="margin-top:30px;" ></div>
        <br>
      <br>
      <div class="input-group input-group-lg col-lg-offset-4" style="margin: auto;">
        <span class="input-group-addon" style="width:110px;">帳號</span>
        <input autofocus class="form-control" style="font-size:25px;" placeholder="工號" @keydown.enter="$refs.password.focus"
          type="text" v-model="userName" ref="userName" data-vv-name="帳號"
          v-validate="'required'">
      </div>
      <span class="alert alert-danger" v-show="errors.has('帳號')">{{ errors.first('帳號') }}</span>
      <br>
      <br>
      <br>
      <div class="input-group input-group-lg col-lg-offset-4" style="margin: auto;">
        <span class="input-group-addon " style="width:110px;">密碼</span>
        <input class="form-control" style="font-size:25px;" placeholder="密碼"
          type="password" v-model="password" @keydown.enter="validate()" ref="password" data-vv-name="密碼"
          v-validate="'required|min:4'">
      </div>
      <span class="alert alert-danger" v-show="errors.has('密碼')">{{ errors.first('密碼') }}</span>

      <div style="margin-bottom:60px;"></div>

      <div class="form-group row" >
        <div class="col-sm-10" align="center">
          <span style="margin:10px;">
            <button class="font-big btn btn-success" type="button" @click="validate()"
              style="width:150px; height:44px; font-size:20px;">
              登入
            </button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Header from './Header'
import LoginService from '@/services/loginService'

export default {
  name: 'Login',
  components: {
    Header
  },
  data () {
    return {
      title: 'IMPS來料作業系統',
      userName: '',
      password: '',
      domain: this.$store.state.domain
    }
  },
  computed: {

  },
  created: function () {
    let version = this.$store.state.version
    window.localStorage.clear()
    this.$store.dispatch('updateVersion', {
      version: version
    })
  },
  methods: {
    login: function () {
      this.errors.clear()
      this.$parent.showLoader()
      fetch(this.domain + '/WIPF/IMPS_API.do?reqCode=login', {
        method: 'POST',
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(data => {
          this.$parent.hideLoader()
          console.log(data)
          if (data.result === 'Y') {
            this.$store.dispatch('updateUserInfo', {
              userInfo: data.userInfo
            })
            LoginService.direct({userInfo: this.$store.state.userInfo, vm: this})
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
          vm.login()
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
