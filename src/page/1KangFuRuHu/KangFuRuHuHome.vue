<template>
  <div>
    <app-panel :title="title" :list="list" :link="link" type="info" canAdd></app-panel>
  </div>
</template>
<script>
import AppPanel from "@/components/AppPanel";

export default {
  components: {
    AppPanel
  },
  data() {
    return {
      title: "精准康复入户患者列表",
      link: "KangFuRuHuDetail",
      list: [],
      canAdd: true
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      //this.$api.getDisableds().then(res => { this.list = res })
      let user = localStorage.getItem("loginUserBaseInfo");
      var userID = JSON.parse(user);
      var json = {
        userID: userID.I
      };
      this.$api.getDisableds(json).then(res => {
        this.list = res;
      });
    }
  }
};
</script>