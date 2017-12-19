<template>
  <div style="height:100%">
    <x-header :left-options="{backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;" >
      辅具上门评估适配
      <router-link slot="right" to="/FuJuPingGuDetail"><i class="fa fa-plus fa-lg"></i></i></router-link>
    </x-header>
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false" :offset="46">
      <tab v-model="index" @on-before-index-change="switchTabItem">
        <tab-item selected>辅具上门评估</tab-item>
        <tab-item>假肢矫形器</tab-item>
        <tab-item>无障碍改造</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" ref="swiper" :height="clientHeight" :show-dots="false">
      <swiper-item>
        <app-card :list="fuJuShangMenList" ></app-card>
      </swiper-item>
      <swiper-item>
      </swiper-item>
      <swiper-item>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import AppCard from '@/components/AppCard'

import {XHeader,Tab,TabItem,Swiper,SwiperItem,Sticky,Group} from 'vux'
export default {
  name: 'FuJuPingGuHome',
    components: {
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Sticky,
      Group,
      AppCard,
  },
  data () {
    return {
      clientHeight:"",
      fuJuShangMenList:[],
      index:0,
    }
  },
  created () {
    this.initData()
  },
  mounted(){
       this.clientHeight = `${(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-92}px`;
  },
  methods: {
    initData () {
      this.$api.GetDisabledInfoes({forListType:'评估',examName:'上门'}).then(res => { this.fuJuShangMenList = res })
    },
    switchTabItem (index) {
      
    },
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
