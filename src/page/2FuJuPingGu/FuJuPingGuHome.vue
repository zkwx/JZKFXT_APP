<template>
  <div>
    <group :title="title">
      <cell v-for="(item,key) in menus" :key="key" :title="item.title" :isLink="item.isLink" :link="item.link">
        <img slot="icon" :src="item.img" class="cell-icon">
      </cell>
    </group>
  </div>
</template>
<script>
import {Group,Cell} from 'vux'
export default {
    components: {
      Group,
      Cell,
  },
  data () {
    return {
      title:"辅具上门评估适配",
      menus:[
        {
          title:'辅具评估',
          isLink:true,
          link:'/ExamList/type/FuJuPingGu/categoryTabs',
          img:require('../../assets/icon/i1.png')
        },
        {
          title:'假肢矫形器',
          isLink:true,
          link:'/ExamList/type/JiaZhiJiaoXingQi/jiaZhiJiaoXingQiTabs',
          img:require('../../assets/icon/i2.png')
        },
        {
          title:'无障碍改造',
          isLink:true,
          link:'/ExamList/name/WuZhangAiGaiZao/wuZhangAiTabs',
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
