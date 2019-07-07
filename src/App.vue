<template>
  <div id="app">
    <loader v-if="isLoading"/>
    <router-view/>
    <div class="right-bottom">
      Ver {{this.$store.state.version}}
    </div>
  </div>
</template>

<script>

import Message from 'iview'
import Loader from '@/components/Loader'
import MainService from '@/services/mainService'

export default {
  data () {
    return {
      domain: this.$store.state.domain,
      version: this.$store.state.version,
      isLoading: false,
      syncCountdown: 300,
      reloadCountdown: 10
    }
  },
  name: 'App',
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' }
    ]
  },
  components: {
    Loader,
    Message
  },
  methods: {
    showLoader: function () {
      this.isLoading = true
    },
    hideLoader: function (e) {
      this.isLoading = false
      if (e !== undefined) {
        this.$Message.info(e.toString())
      }
    }
  },
  created: function () {
    this.$store.dispatch('initDomain', {
      API_URL: process.env.API_URL
    })
    MainService.syncServerCode(this)
    setInterval(() => {
      MainService.syncServerCode(this)
    }, this.syncCountdown * 1000)
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 10px;
  font-size:15px;
}

.right-bottom {
  position:absolute;
  right:0;
  bottom:0;
  font-size:12px;
  color:gray;
  padding:5px;
  font-weight: bolder;
}

.font-big {
  font-size: 20px;
}

.font-middle {
  font-size: 15px;
}

.font-small {
  font-size: 13px;
}

.font-small-xs {
  font-size: 11px;
}

.break {
  word-break:break-all;
}

.space {
  padding: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.space-xs {
  padding: 1px;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 1px;
  padding-right: 1px;
}

th {
    background-color:#0099FF;
    color: white;
    text-align: center;
}

td {
    text-align: left;
}

.right {
  text-align: right;
  font-size:15px;
  font-weight: bolder;
}

.left {
  text-align: left;
}

.required {
  background-color: #FFFF99;
  font-size:17px;
  font-weight: bolder;
}

</style>
