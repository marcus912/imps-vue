<template>
  <div class="container">
    <Header :title="title"/>
    <form>
      <div style="margin-bottom:100px;"/>
      <div class="form-group row">
        <div class="col-sm-10" align="center">
          <router-link :to="{ path: 'IMPS03002'}">
           <button class="font-big btn btn-success" type="button"
                style="width:200px; height:60px;color:white;font-weight:bold; font-size: 20px;">
              ASN號碼(EP)
            </button>
            </router-link>
        </div>
      </div>
      <br>
      <br>
      <br>

      <div class="form-group row">
        <div class="col-sm-10" align="center">
          <router-link :to="{ path: 'IMPS03003'}">
           <button class="font-big btn btn-success" type="button" :disabled="this.$store.state.userInfo.isManual !== 'Y'"
                style="width:200px; height:60px;color:white;font-weight:bold; font-size: 20px;">
                手工單(非EP)
              </button>
          </router-link>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import Header from './Header'

export default {
  name: 'IMPS03001',
  components: {
    Header
  },
  data () {
    return {
      title: '來料來源選取'
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
<style scoped>

</style>
