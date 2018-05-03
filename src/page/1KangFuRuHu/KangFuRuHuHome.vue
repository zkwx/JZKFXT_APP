<template>
  <div>
    <!-- <app-panel :title="title" :list="list" :link="link" type="info" canAdd></app-panel> -->

    <group :title="title">
      <cell v-for="(item,key) in menus" :key="key" :title="item.title" :isLink="item.isLink" :link="item.link">
        <img slot="icon" :src="item.img" class="cell-icon">
      </cell>
    </group>


  </div>
</template>
<script>
import AppPanel from "@/components/AppPanel";
import {
  XHeader,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  Sticky,
  Group,
  Cell
} from "vux";
export default {
  components: {
    XHeader,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Sticky,
    Group,
    AppPanel,
    Cell
  },
  data() {
    return {
      title: "精准康复入户患者列表",
      link: "KangFuRuHuDetail",
      list: [],
      canAdd: true,
      index: 0,
      menus: [
        {
          title: "未入户",
          isLink: true,
          link: "/DisabledList/type/KangFuRuHuHome/noTabs",
          img: require("../../assets/icon/i1.png")
        },
        {
          title: "已入户",
          isLink: true,
          link: "/DisabledList/type/KangFuRuHuHome/okTabs",
          img: require("../../assets/icon/i2.png")
        }
      ]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      //this.$api.getDisableds().then(res => { this.list = res })
      let user = localStorage.getItem("loginUserBaseInfo");
      var userID = JSON.parse(user);
      var json = {
        userID: userID.I
      };
      await this.$api.getDisableds(json).then(res => {
        this.list = res;
      });
    },
  }
};
</script>