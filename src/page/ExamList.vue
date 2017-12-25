<template>
  <div style="height:100%">
    <!-- <x-header :left-options="{backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100;" >
      辅具上门评估适配
      <router-link slot="right" to="/FuJuPingGuDetail"><i class="fa fa-plus fa-lg"></i></router-link>
    </x-header> -->
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false">
      <tab v-model="index" @on-before-index-change="switchTabItem">
        <tab-item v-for="(value,key) in tabs" :key="key" :selected="key===0">{{value.name}}</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" ref="swiper" :height="clientHeight" :show-dots="false">
      <swiper-item v-for="(value,key) in tabs" :key="key">
        <app-panel :list="list[value.name]" :link="link" type="exam"></app-panel>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import AppPanel from '@/components/AppPanel'

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
      AppPanel,
  },
  props: {
    examBy:String,
    name:String,
    displayType:String,
  },
  data () {
    return {
      tabs:[{name:'视力'},{name:'听力'},{name:'肢体'},{name:'脑瘫'},{name:'偏瘫'},{name:'脊髓损伤'}],
      list:{},
      link:"ExamDetail",
      clientHeight:"",
      index:null,
    }
  },
  created () {
    this.initData()
  },
  mounted(){
    this.clientHeight = `${(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-92}px`;
  },
  methods: {
    async initData () {
      let res = await this.$api.GetDisabledInfoes({examby:this.examBy,name:this.name}) 
      for (const key in res) {
        const element = res[key];
        let name = element[0].CurrentExam.Exam.Name
        this.list[name]=element
      }
      this.index=1
      this.index=0
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
