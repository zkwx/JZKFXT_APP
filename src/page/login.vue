<template>
<div class="login">
<div :style ="note">
	<div id="login" >
  <!-- <img :src="background"> -->
      <h2 style="text-align:center;padding-top: 30px;">基层精准康复辅助服务系统</h2>
		<form v-on:submit.prevent="submit">
            <group label-width="70px" class="loginGroup">
            <x-input title="用户名" v-model="user.UserName" placeholder="请输入你的用户名" ref="UserNameRef" required></x-input>
             </group>
              <group label-width="70px" class="loginGroup">
            <x-input title="密码" v-model="user.Password" placeholder="请输入你的密码" type="password" ref="PasswordRef" required></x-input>
            </group>
            <group label-width="70px" class="loginGroup">
            <x-button type="primary" @click="submit">登录</x-button>
             </group>
		</form>
    <!-- <div style="text-align:center;">
    <a href="#/register">没有账号?点击注册</a>
  </div> -->
	</div>
</div>
<div class="foot">
  <p>西安聚仁汇通医疗科技有限公司</p>
  <p>陕ICP备18006039号</p>
</div>
</div>
</template>
<style scoped>
.login {
  height: 100%;
}
.loginGroup {
  padding: 40px 50px 0 50px;
}
.foot {
  text-align: center;
}
</style>
<script>
import { Group, XInput, XButton, ConfirmPlugin } from "vux";

export default {
  name: "login",
  components: {
    Group,
    XInput,
    XButton,
    ConfirmPlugin
  },
  data() {
    return {
      note: {
        backgroundImage: "url(" + require("@/assets/icon/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height: "100%"
      },
      user: {
        UserName: "",
        Password: ""
      }
    };
  },
  methods: {
    submit() {
      var msg = "";
      if (true) {
        if (this.$refs.UserNameRef.value === "") {
          msg = this.$refs.UserNameRef.title + "必填哦!";
        } else if (this.$refs.PasswordRef.value === "") {
          msg = this.$refs.PasswordRef.title + "必填哦!";
        }
      }
      if (msg === "") {
        var formData = this.user;
        this.$api
          .loginUser(formData)
          .then(r => {
            let User = {
              I: r.ID,
              R: r.RoleID
            };
            localStorage.setItem("loginUserBaseInfo", JSON.stringify(User));
            //若验证成功跳转
            if (r.RoleID > 0 && r.RoleID < 3) {
              var redirect = decodeURIComponent(
                this.$route.query.redirect || "/KangFuRuHuHome"
              );
            } else if (r.RoleID > 2 && r.RoleID < 10) {
              var redirect = decodeURIComponent(
                this.$route.query.redirect || "/JiGouPingGuHome"
              );
            } else if (r.RoleID > 9 && r.RoleID < 12) {
              var redirect = decodeURIComponent(
                this.$route.query.redirect || "/ZongHeKangFuHome"
              );
            } else {
              var redirect = decodeURIComponent(
                this.$route.query.redirect || "/profile"
              );
            }

            this.$router.push({
              // 你需要接受路由的参数再跳转
              path: redirect
            });
          })
          .catch(r => {
            this.$router.push("/");
            this.$utils.Alert("登录失败", "用户名或密码错误");
          });
      } else {
        this.$utils.Alert("错误信息", msg);
      }
    },
    onCancel() {
      console.log("on cancel");
    },
    onConfirm(msg) {
      console.log("on confirm");
      if (msg) {
        alert(msg);
      }
    }
  }
};
</script>