<template>
  <view-box body-padding-top="10px" body-padding-bottom="55px">
  <card v-for="(item,index) in list" :key="index">
    <div slot="content">
        <app-panel-item :item="item" :isLink="isLink" :link="link"></app-panel-item>
        <cell v-for="(detial,index) in item.detials" :key="index" :title="detial.category+'-'+detial.degree" is-link :link="'/FuJuPingGuDetail/'+item.id+'/'+detial.targetExamName+'/'+detial.done">
          <div>
            <h4 v-if="detial.done" style="color: #09BB07">已评估</h4>
            <h4 v-if="!detial.done" style="color: #5bc0de">待评估</h4>
          </div>
        </cell>
    </div> 
  </card>
  </view-box>
</template>
<script>
  import AppPanelItem from '@/components/AppPanelItem'

  import { Panel,Card,Cell,ViewBox } from 'vux'
  export default {
    name: 'AppCard',
    components: {
      Panel,
      Card,
      Cell,
      ViewBox,
      AppPanelItem
    },
    props: {
      isLink:Boolean,
      link:String,
      list: Array,
    },
    data(){
      return{
        sex:{
          male:require("@/assets/icon/male.png"),
          female:require("@/assets/icon/female.png"),
        },
        avatar:{
          male:require("@/assets/icon/avatar-male.png"),
          female:require("@/assets/icon/avatar-female.png"),
        },
      }
    },
    methods:{
    },
  }
</script>


<style scoped>
</style>