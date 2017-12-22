<template>
  <div class="weui-panel weui-panel_access">
    <div class="weui-panel__bd">
      <app-panel-item v-for="(item,index) in list" :key="index" :item="item" isLink :link="'/'+link+'/'+item.id"></app-panel-item>
    </div> 
  </div>
</template>
<script>
  import AppPanelItem from '@/components/AppPanelItem'
  import { Panel } from 'vux'
  export default {
    name: 'AppPanel',
    components: {
      Panel,
      AppPanelItem
    },
    props: {
      list: Array,
      link:String,
    },
    data(){
      return{

      }
    },
    methods:{
    }
  }
</script>