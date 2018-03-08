<template>
<div>
	<div id="login">
		<form v-on:submit.prevent="submit">
                <h1 style="text-align:center;">精准康复系统</h1>
            <group label-width="70px" class="loginGroup">
            <x-input title="用户名" v-model="user.UserName" placeholder="请输入你的用户名" ref="UserNameRef" required></x-input>
            <x-input title="密码" v-model="user.Password" placeholder="请输入你的密码" type="password" ref="PasswordRef" required></x-input>
			<x-button type="primary" @click="submit">登录</x-button>
            </group>
		</form>
	</div>
</div>
</template>
<style scoped>
.loginGroup {
  padding: 40px;
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
      user: {
        UserName: "",
        Password: ""
      }
    };
  },
  methods: {
    submit() {
      // var valid = this.$refs.UserNameRef.valid && this.$refs.PasswordRef.valid
      // if(valid){
      //     var formData = this.user;
      //     this.$http.get('Users', formData, r => {
      //         var result = r.data;
      //         console.log(r);
      //         this.$router.push('KangFuRuHuHome')
      //     },r=>{
      //         this.$vux.alert.show({
      //             title: '登录失败',
      //             content: '用户名或密码错误。'
      //         })
      //         console.log(r);
      //     })
      // }
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
        // var json = {
        //   user:formData,
        //   login:true
        // }
        // this.$http.get("Users",json).then(r =>{
        //   this.$utils.Alert(r);
        // });
        this.$api
          .loginUser(formData)
          .then(r => {
            localStorage.setItem("loginUserBaseInfo", JSON.stringify(r.ID));
            //若验证成功跳转
            var redirect = decodeURIComponent(
              this.$route.query.redirect || "/KangFuRuHuHome"
            );
            this.$router.push({
              // 你需要接受路由的参数再跳转
              path: redirect
            });
          })
          .catch(r => {
            this.$router.push("/");
            this.$utils.Alert("登录失败", "用户名或密码错误");
          });
      }else{
        this.$utils.Alert("错误信息",msg);
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