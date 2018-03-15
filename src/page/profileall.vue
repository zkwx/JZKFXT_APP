<template>
  <div>
    <app-panel :title="title" :list="list" :link="link" type="user" canAdd></app-panel>
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
      title: "用户列表",
      link: "profileDetail",
      list: [],
      canAdd: true
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let user = localStorage.getItem("loginUserBaseInfo");
      var userID = JSON.parse(user);
      var json = {
        userID: userID.I
      };
      this.$http.get("Users").then(r => {
        for (let i = 0; i < r.length; i++) {
          if (r[i].RoleID != 12) {
            this.list.push(r[i]);
          }
        }
      });
    }
  }
};
</script>