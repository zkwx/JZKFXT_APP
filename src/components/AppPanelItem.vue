<template>
  <div class="weui-media-box weui-media-box_appmsg weui-cell_access" @click="isLink?onClick():null">
    <div class="weui-media-box__hd" v-if="type!='user'">
      <img :src="item.Sex===1?avatar.male:avatar.female" alt="" class="weui-media-box__thumb">
    </div>
    <div class="weui-media-box__bd" v-if="type!='user'">
      <span class="weui-media-box__title">{{item.Name}}<img class="icon" :src="item.Sex===1?sex.male:sex.female"/></span>
      <p class="weui-media-box__desc">{{item.Category}}-{{item.Degree}}<br></p>
    </div>
     <div class="weui-media-box__hd" v-if="type==='user'">
      <img :src="item.Img!=''?item.Img:item.Sex===1?avatar.male:avatar.female" alt="" class="weui-media-box__thumb">
    </div>
    <div class="weui-media-box__bd" v-if="type==='user'">
      <span class="weui-media-box__title">{{item.RealName}}
        <img class="icon" :src="item.Sex===1?sex.male:sex.female"/>
        </span>
      <p class="weui-media-box__desc">联系方式 - {{item.Phone}}<br></p>
       <p class="weui-media-box__desc">地址 - {{Address}}<br></p>
    </div>
    <div v-if="type==='exam'">
      <span><img class="cell-icon" :src="exam"/>{{item.Exam.Name}}</span>
      <span v-if="item.State===0" style="color: #5bc0de">待评估</span>
      <span v-if="item.State===1" style="color: #127e9e">已评估</span>
      <span v-if="item.State===2" style="color: #09BB07">待审核</span>
      <span v-if="item.State===3" style="color: #078006">待完成</span>
      <span v-if="item.State===4" style="color: #078006">待回访</span>
      <span v-if="item.State===5" style="color: #078006">已完成</span>
    </div>
     <div v-if="type==='info' || type ==='no'">
      <span><img class="cell-icon" :src="exam"/>{{this.name}}</span>
      <span v-if="state===0" style="color: #5bc0de">待评估</span>
      <span v-if="state===1" style="color: #127e9e">已评估</span>
      <span v-if="state===2" style="color: #09BB07">待审核</span>
      <span v-if="state===3" style="color: #078006">待完成</span>
      <span v-if="state===4" style="color: #078006">待回访</span>
      <span v-if="state===5" style="color: #078006">已完成</span>
    </div>
    <span v-if="isLink || !!link" class="weui-cell__ft"></span>
  </div>
</template>
<script>
import { Panel, ChinaAddressV4Data, Value2nameFilter as value2name } from "vux";
export default {
  name: "AppPanel",
  components: {
    Panel
  },
  props: {
    item: Object,
    type: String,
    isLink: Boolean,
    link: String
  },
  data() {
    return {
      sex: {
        male: require("@/assets/icon/male.png"),
        female: require("@/assets/icon/female.png")
      },
      avatar: {
        male: require("@/assets/icon/avatar-male.png"),
        female: require("@/assets/icon/avatar-female.png")
      },
      exam: require("@/assets/icon/exam.png"),
      state: null,
      name: "",
      Address: "",
      Addresses: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let user = localStorage.getItem("loginUserBaseInfo");
      var userID = JSON.parse(user).I;
      let examName;
      let disabledID;
      if (this.type != "user") {
        if (!this.item.Category || !this.item.ID) {
          examName = this.item.Exam.Name;
          disabledID = this.item.DisabledID;
        } else {
          examName = this.item.Category;
          disabledID = this.item.ID;
        }
        let exam = {
          ExamName: examName,
          DisabledID: disabledID,
          userID: userID
        };
        this.$http.get("Disableds/Exam", exam).then(r => {
          this.state = r[0].State;
          this.name = r[0].Exam.Name;
        });
      }
      //用户地址
      if (this.item.Address) {
        this.Addresses = [
          this.item.Address.slice(0, 2) + "0000",
          this.item.Address.slice(0, 4) + "00",
          this.item.Address
        ];
      }
      this.Address = value2name(this.Addresses, ChinaAddressV4Data);
    },
    onClick() {
      this.$router.push(this.link);
    }
  }
};
</script>
<style scoped>
span {
  font-weight: bold;
}
</style>
