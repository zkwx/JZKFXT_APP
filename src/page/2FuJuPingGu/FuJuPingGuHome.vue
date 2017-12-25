<template>
  <div>
    <group title="辅具上门评估适配">
      <cell v-for="(item,key) in menus" :key="key" :title="item.title" :isLink="item.isLink" :link="item.link">
        <img slot="icon" :src="item.img" class="cell-icon">
      </cell>
    </group>
  </div>
</template>
<script>
import {Group,Cell} from 'vux'
export default {
  name: 'FuJuPingGuHome',
    components: {
      Group,
      Cell,
  },
  data () {
    return {
      menus:[
        {
          title:'辅具评估',
          isLink:true,
          link:'/ExamList/type/FuJuPingGu/2',
          img:require('../../assets/icon/i1.png')
        },
        {
          title:'假肢矫形器',
          isLink:true,
          link:'/FuJuShenHeHome',
          img:require('../../assets/icon/i2.png')
        },
        {
          title:'无障碍审核',
          isLink:true,
          link:'/FuJuShenHeHome',
          img:require('../../assets/icon/i3.png')
        },
      ]
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

<style scoped>

</style>
