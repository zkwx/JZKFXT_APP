<template>
  <div style="height:100%">
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false">
      <tab v-model="index" @on-before-index-change="switchTabItem">
        <tab-item v-for="(value,key) in tabs" :key="key" :selected="key===0">{{value.name}}</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" ref="swiper" :height="clientHeight" :show-dots="false">
      <swiper-item v-for="(value,key) in tabs" :key="key">
        <app-panel :title="value.name+'患者列表'" :list="list[value.name]" :link="link" type="exam" canAdd></app-panel>
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
      tabs:[],
      categoryTabs:[{name:'视力'},{name:'听力'},{name:'肢体'},{name:'脑瘫'},{name:'偏瘫'},{name:'脊髓损伤'}],
      jiaZhiJiaoXingQiTabs:[{name:'长江新里程'},{name:'其它假肢'},{name:'矫形器'}],
      wuZhangAiTabs:[{name:'无障碍改造'}],
      list:{},
      link:"ExamDetail",
      clientHeight:"",
      index:0
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
      switch (this.displayType) {
        case 'categoryTabs':
          this.tabs=this.categoryTabs
          break;
        case 'jiaZhiJiaoXingQiTabs':
          this.tabs=this.jiaZhiJiaoXingQiTabs
          break;
        case 'wuZhangAiTabs':
        this.tabs=this.wuZhangAiTabs
          break;
        default:
          break;
      }
      let res = await this.$api.GetDisabledInfoes({examby:this.examBy,name:this.name}) 
      let list={}
      for (const key in res) {
        const element = res[key];
        let name = element[0].CurrentExam.Exam.Name
        list[name]=element
      }
      this.list = list
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
