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
import AppPanel from "@/components/AppPanel";

import { XHeader, Tab, TabItem, Swiper, SwiperItem, Sticky, Group } from "vux";
import { log } from "util";
export default {
  name: "FuJuPingGuHome",
  components: {
    XHeader,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Sticky,
    Group,
    AppPanel
  },
  props: {
    examBy: String,
    name: String,
    displayType: String
  },
  data() {
    return {
      tabs: [],
      //categoryTabs:[{name:'视力'},{name:'听力'},{name:'肢体'},{name:'脑瘫'},{name:'偏瘫'},{name:'脊髓损伤'}],
      categoryTabs: [
        //{ name: "假肢" },
        //{ name: "无障碍" },
        { name: "视力" },
        { name: "听力" },
        { name: "肢体" },
        { name: "脑瘫" },
        { name: "偏瘫" },
        { name: "脊髓损伤" }
      ],
      jiaZhiJiaoXingQiTabs: [
        { name: "长江新里程" },
        { name: "其它假肢" },
        { name: "矫形器" }
      ],
      wuZhangAiTabs: [{ name: "无障碍改造" }],
      userTabs: [{ name: "用户管理" }],
      list: {},
      link: "",
      clientHeight: "",
      index: 0
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.clientHeight = `${(window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight) - 92}px`;
  },
  methods: {
    async initData() {
      switch (this.displayType) {
        case "categoryTabs":
          this.tabs = this.categoryTabs;
          break;
        case "jiaZhiJiaoXingQiTabs":
          this.tabs = this.jiaZhiJiaoXingQiTabs;
          break;
        case "wuZhangAiTabs":
          this.tabs = this.wuZhangAiTabs;
          break;
        case "userTabs":
          this.tabs = this.userTabs;
        default:
          break;
      }
      let lu = localStorage.getItem("loginUserBaseInfo");
      let id = JSON.parse(lu).I;
      let res = await this.$api.getExamRecords({
        examby: this.examBy,
        name: this.name,
        userID: id
      });
      let list = {};

      switch (this.displayType) {
        case "categoryTabs":
          for (const key in res) {
            const element = res[key];
            let name = element[0].Exam.Name;
            list[name] = element;
          }
          break;
        case "jiaZhiJiaoXingQiTabs":
          for (const key in res) {
            const element = res[key];
            let name = element[0].ShowArea;
            list[name] = element;
          }
          break;
        case "wuZhangAiTabs":
          for (const key in res) {
            const element = res[key];
            let name = element[0].ShowArea;
            list[name] = element;
          }
          break;
        default:
          break;
      }
      this.list = list;

      switch (this.name) {
        //辅具评估
        case "FuJuPingGu":
          this.link = "ExamDetail";
          break;
        //假肢矫形器评估
        case "JiaZhiJiaoXingQi":
          this.link = "ExamDetail";
          break;
        //无障碍改造
        case "WuZhangAiGaiZao":
          this.link = "ExamDetail";
          break;
        //辅具审核
        case "FuJuShenHe":
          this.link = "ExamAudit";
          break;
        //假肢矫形器审核
        case "JiaZhiJiaoXingQiShenHe":
          this.link = "ExamAudit";
          break;
        //无障碍审核
        case "WuZhangAiShenHe":
          this.link = "ExamAudit";
          break;
        //辅具服务回访
        case "FuJuFuWuHuiFang":
          this.link = "AssistVisit";
          break;
        //辅具回访
        case "FuJuFuWu":
          this.link = "AssistService";
          break;
        //机构评估
        case "JiGouPingGu":
          this.link = "JiGou";
          break;
        //康复服务
        case "KangFuFuWu":
          this.link = "FuWu";
          break;
        default:
          break;
      }
    },
    switchTabItem(index) {}
  },
  computed: {},
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
