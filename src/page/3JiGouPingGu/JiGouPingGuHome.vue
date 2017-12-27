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
      title:"机构评估与审核",
      menus:[
        {
          title:'辅具审核',
          isLink:true,
          link:'/ExamList/type/FuJuShenHe/categoryTabs',
          img:require('../../assets/icon/i1.png')
        },
        {
          title:'假肢矫形器审核',
          isLink:true,
          link:'/ExamList/type/JiaZhiJiaoXingQiShenHe/jiaZhiJiaoXingQiTabs',
          img:require('../../assets/icon/i2.png')
        },
        {
          title:'无障碍审核',
          isLink:true,
          link:'/ExamList/name/WuZhangAiShenHe/wuZhangAiTabs',
          img:require('../../assets/icon/i3.png')
        },
        {
          title:'机构评估',
          isLink:true,
          link:'/ExamList/type/JiGouPingGu/categoryTabs',
          img:require('../../assets/icon/i3.png')
        },
      ],
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
