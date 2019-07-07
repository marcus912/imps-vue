<template>
  <div>
    <div class="row label-info" align="center" >
      <span class="glyphicon glyphicon-align-justify" style="font-size:25px;float: left; padding-left: 10px; padding-top:5px;"
        v-on:click="drawerWitdh=250" v-show="title != 'IMPS來料作業系統'"/>
      <span style="font-size:25px; padding:5px; font-weight: bold;">
        {{title}}
      </span>
      <span class="glyphicon glyphicon-log-out" style="font-size:25px; float: right; padding-right: 10px; padding-top:5px;"
        v-confirm="{ok: logout, cancel: cancel, message: '是否登出'}" v-show="title != 'IMPS來料作業系統'"/>
    </div>
    <div class="sidenav" v-bind:style="{ width: drawerWitdh + 'px'}" v-on:click="drawerWitdh=0">
      <div v-show="drawerWitdh!=0">
        <a href="javascript:void(0)" class="closebtn drawer-word" v-on:click="drawerWitdh=0">&times;</a>
        <a href="#" @click="$router.push({name: 'IMPS03002'})">ASN號碼(EP)</a>
        <a href="#" @click="$router.push({name: 'IMPS03003'})" v-if="this.$store.state.userInfo.isManual==='Y'">手工單(非EP)</a>
        <a href="#" @click="$router.push({name: 'MuserSet'})">密碼修改</a>
        <a>
          版本
          <span class="space" style="font-size:15px">V{{this.$store.state.version}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  props: [
    'title'
  ],
  data () {
    return {
      drawerWitdh: 0
    }
  },
  methods: {
    logout: function () {
      this.$router.push({name: 'login'})
    },
    cancel: function () {

    },
    isLogin: function () {
      return this.$store.state.userInfo === undefined
    }
  },
  created: function () {

  }
}
</script>

<style scoped>
.sidenav {
  height: 100%;
  position: fixed;
  z-index: 3;
  width: 0;
  top: 0;
  left: 0;
  background-color: #000000;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  opacity: 0.9
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 27px;
  font-weight: bold;
  color: #818181;
  display: block;
  transition: 0.3s;
  margin-bottom: 18px;
  opacity: 1
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
