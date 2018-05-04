<template>
  <div style="height:100%">
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false">
      <tab v-model="index" @on-before-index-change="switchTabItem">
        <tab-item v-for="(value,key) in tabs" :key="key" :selected="key===0">{{value.name}}</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" ref="swiper" :height="clientHeight" :show-dots="false">
      <swiper-item v-for="(value,key) in tabs" :key="key">
        <app-panel :title="value.name+'患者列表'" :list="list[value.name]" :link="link" type="no" :canAdd="canAdd"></app-panel>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import AppPanel from "@/components/AppPanel";

import { XHeader, Tab, TabItem, Swiper, SwiperItem, Sticky, Group } from "vux";
import { log } from "util";
export default {
  name: "KangFuRuHuHome",
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
      noTabs: [{ name: "未入户" }],
      okTabs: [{ name: "已入户" }],
      list: {},
      noList: [],
      okList: [],
      link: "",
      clientHeight: "",
      index: 0,
      canAdd: false
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
        case "noTabs":
          this.tabs = this.noTabs;
          this.canAdd = true;
          break;
        case "okTabs":
          this.tabs = this.okTabs;
          break;
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

      for (const k in res) {
        const ele = res[k];
        if (ele.length === 1) {
          let state = ele[0].State;
          if (state === 0) {
            this.noList.push(ele[0]);
            list["未入户"] = this.noList;
          } else {
            this.okList.push(ele[0]);
            list["已入户"] = this.okList;
          }
        } else {
          let flag = false;
          for (let i = 0; i < ele.length; i++) {
            if (ele[i].State != 0) {
              flag = true;
            }
          }

          if (!flag) {
            this.noList.push(ele[0]);
            list["未入户"] = this.noList;
          } else {
            this.okList.push(ele[0]);
            list["已入户"] = this.okList;
          }
        }
      }
      this.list = list;

      switch (this.name) {
        //康复入户
        case "KangFuRuHuHome":
          this.link = "/KangFuRuHuDetail";
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
