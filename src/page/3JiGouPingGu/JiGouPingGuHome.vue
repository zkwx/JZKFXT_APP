<template>
  <div>
    <group title="机构评估与审核">
      <cell title="辅具审核" is-link link="/FuJuShenHeHome">
        <img slot="icon" src="../../assets/icon/i1.png" class="cell-icon">
      </cell>
      <cell title="假肢矫形器" is-link link="">
        <img slot="icon" src="../../assets/icon/i2.png" class="cell-icon">
      </cell>
      <cell title="无障碍审核" is-link link="">
        <img slot="icon" src="../../assets/icon/i3.png" class="cell-icon">
      </cell>
      <cell title="机构评估" is-link link="">
        <img slot="icon" src="../../assets/icon/i4.png" class="cell-icon">
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
