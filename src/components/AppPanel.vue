<template>
<div>
  <search
    :results="results"
    position="absolute"
    auto-scroll-to-top 
    @on-result-click="resultClick"
    @on-change="getResult"
    @on-focus="onFocus"
    @on-cancel="onCancel"
    @on-submit="onSubmit"
    ref="search">
      <router-link slot="right" :to="link">新增</router-link>
    </search>
  <div v-if="title" class="weui-cells__title">{{title}}</div>
  <div class="weui-panel weui-panel_access">    
    <div class="weui-panel__bd">
      <app-panel-item v-for="(item,key) in filterList" :key="key" :item="item" :type="type" isLink :link="getLink(item)"></app-panel-item>
    </div> 
  </div>
</div>
</template>
<script>
  import AppPanelItem from '@/components/AppPanelItem'
  import { Panel,Search } from 'vux'
  export default {
    name: 'AppPanel',
    components: {
      Panel,
      Search,
      AppPanelItem
    },
    props: {
      title: String,
      list: Array,
      type: String,
      isLink: Boolean,
      link: String,
    },
    data(){
      return{
        filterList: [],
        results: [],
        value: '姓名',
      }
    },
    created () {
      
    },
    methods:{
      getLink(item){
        let clink=clink='/'+this.link+'/'+item.ID
        if (this.type==='exam') {
          clink += '/'+item.CurrentExam.Exam.ID+'/'+item.CurrentExam.State
        }
        return clink
      },
      resultClick (item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      getResult (val) {

        this.results = val ? getResult(this.value) : []
      },
      onFocus () {
        console.log('on focus')
      },
      onCancel () {
        console.log('on cancel')
      },
      onSubmit () {
        this.$refs.search.setBlur()
        
      },
    },
    watch:{
      list(){
        this.filterList=this.list
      }
    }
  }
</script>