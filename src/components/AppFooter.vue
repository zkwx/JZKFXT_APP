<template>
<div style="width:100%;left:0;top:0;z-index:100;">
    <tabbar>
      <tabbar-item link="/KangFuRuHuHome" :selected="this.$route.path==='/KangFuRuHuHome'">
        <img slot="icon" src="../assets/icon/1.png">
        <img slot="icon-active" src="../assets/icon/1a.png">
        <span slot="label">康复入户</span>
      </tabbar-item>
      <tabbar-item link="/FuJuPingGuHome" :selected="this.$route.path==='/FuJuPingGuHome'">
        <img slot="icon" src="../assets/icon/2.png">
        <img slot="icon-active" src="../assets/icon/2a.png">
        <span slot="label">辅具评估</span>
      </tabbar-item>
      <tabbar-item link="/JiGouPingGuHome" :selected="this.$route.path==='/JiGouPingGuHome'">
        <img slot="icon" src="../assets/icon/3.png">
        <img slot="icon-active" src="../assets/icon/3a.png">
        <span slot="label">机构评估</span>
      </tabbar-item>
      <tabbar-item link="/ZongHeKangFuHome" :selected="this.$route.path==='/ZongHeKangFuHome'">
        <img slot="icon" src="../assets/icon/4.png">
        <img slot="icon-active" src="../assets/icon/4a.png">
        <span slot="label">综合康复</span>
      </tabbar-item>
      <tabbar-item link="/FuWuHuiFangHome" :selected="this.$route.path==='/FuWuHuiFangHome'">
        <img slot="icon" src="../assets/icon/5.png">
        <img slot="icon-active" src="../assets/icon/5a.png">
        <span slot="label">服务回访</span>
      </tabbar-item>
      <tabbar-item link="/profile" :selected="this.$route.path==='/profile'">
        <img slot="icon" src="../assets/icon/6.png">
        <img slot="icon-active" src="../assets/icon/6a.png">
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
</div>
</template>
<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    name: 'AppFooter',
    components: {
      Tabbar,  
      TabbarItem,
    },
    data(){
      return{
        
        index:0
      }
    },
    methods:{
    }
  }
</script>