<template>
  <div class="container">
    <Header :title="title"/>
    <form>
      <div style="margin-bottom:20px;"/>
      <div style="height: 320px; overflow-y: scroll;">
        <div class="form-group row" style="margin-bottom: 20px;"
          v-for="item in items" v-bind:key="item.ITEM_NO">
          <div class="col-sm-10" align="center">
              <router-link :to="{ name: 'IMPS03003_2', params: {items: items, item: item} }">
                <button class="btn btn-success" type="button"
                  style="width:230px; height:60px; color:white; font-size:15px;">
                  {{item.VENDOR_NAME}}  <br>  {{item.ITEM_NO}}
                </button>
              </router-link>
          </div>
        </div>
      </div>
      <br/>
      <div class="form-group row" >
        <div class="col-sm-10" align="center">
          <span style="margin:10px;">
            <button class="font-big btn btn-success" type="button" @click="$router.push({ name: 'IMPS03003'})"
              style="width:150px; height:44px; font-size:20px;">
              上一步
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
  name: 'IMPS03001_1',
  components: {
    Header
  },
  data () {
    return {
      title: '供應商/料號確認',
      domain: this.$store.state.domain,
      items: {}
    }
  },
  computed: {

  },
  methods: {

  },
  created: function () {
    this.items = this.$route.params.items
    if (this.$route.params.items === undefined) {
      this.$router.push({ name: 'IMPS03003', params: {} })
    }
  }
}
</script>
<style scoped>

</style>
