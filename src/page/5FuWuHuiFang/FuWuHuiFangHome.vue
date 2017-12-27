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
      title:"综合服务回访",
      menus:[
        {
          title:'辅具服务回访',
          isLink:true,
          link:'/ExamList/type/FuJuFuWuHuiFang/categoryTabs',
          img:require('../../assets/icon/i1.png')
        },
        {
          title:'康复服务回访',
          isLink:true,
          link:'/ExamList/type/KangFuFuWuHuiFang/categoryTabs',
          img:require('../../assets/icon/i2.png')
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
