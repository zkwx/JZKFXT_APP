<template>
  <div>
    <x-header :left-options="{backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;" >
      机构评估与审核
    </x-header>
    <group>
      <cell title="辅具服务" is-link link="/FuJuFuWuHome">
        <img slot="icon" src="../../assets/icon/i1.png" class="cell-icon">
      </cell>
      <cell title="康复服务" is-link link="/KangFuFuWuHome">
        <img slot="icon" src="../../assets/icon/i2.png" class="cell-icon">
      </cell>
    </group>
  </div>
</template>
<script>
import {XHeader,Group,Cell} from 'vux'
export default {
  name: 'FuJuPingGuHome',
    components: {
      XHeader,
      Group,
      Cell,
  },
  data () {
    return {

    }
  },
  created () {
    
  },
  methods: {
    
  },
  computed:{
    
  },
  watch:{
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
