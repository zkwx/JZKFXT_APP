<template>
  <div class="weui-media-box weui-media-box_appmsg weui-cell_access" @click="isLink?onClick():null">
    <div class="weui-media-box__hd">
      <img :src="item.sex===1?avatar.male:avatar.female" alt="" class="weui-media-box__thumb">
    </div>
    <div class="weui-media-box__bd">
      <span class="weui-media-box__title">{{item.name}}<img class="icon" :src="item.sex===1?sex.male:sex.female"></img></span>
      <p class="weui-media-box__desc">{{item.category}}-{{item.degree}}<br></p>
    </div>
    <span v-if="isLink || !!link" class="weui-cell__ft"></span>
  </div>
</template>
<script>
  import { Panel } from 'vux'
  export default {
    name: 'AppPanel',
    components: {
      Panel
    },
    props: {
      isLink:Boolean,
      link:String,
      item: Object,
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
      onClick () {
        this.$router.push(this.link)
      }
    }
  }
</script>
<style scoped>
span{
  font-weight: bold;
}
</style>
