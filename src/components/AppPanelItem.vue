<template>
  <div class="weui-media-box weui-media-box_appmsg weui-cell_access" @click="isLink?onClick():null">
    <div class="weui-media-box__hd">
      <img :src="item.Sex===1?avatar.male:avatar.female" alt="" class="weui-media-box__thumb">
    </div>
    <div class="weui-media-box__bd">
      <span class="weui-media-box__title">{{item.Name}}<img class="icon" :src="item.Sex===1?sex.male:sex.female"/></span>
      <p class="weui-media-box__desc">{{item.Category}}-{{item.Degree}}<br></p>
    </div>
    <div v-if="type==='exam'">
      <span><img class="cell-icon" :src="exam"/>{{item.CurrentExam.Exam.Name}}</span>
      <span v-if="item.CurrentExam.Done" style="color: #09BB07">已评估</span>
      <span v-if="!item.CurrentExam.Done" style="color: #5bc0de">待评估</span>
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
      item: Object,
      type: String,
      isLink:Boolean,
      link: String,
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
        exam:require("@/assets/icon/exam.png"),
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
