<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar" @click="imageChoose">
            <img :src="user.img">
            <img class="imageUpload" src="../assets/icon/imageUpload.png">
          </div>
          <!-- <p>{{user.name}}</p> -->
          <div class="paddingbottom"></div>
          <input type="file" accept="image" @change="imageChange" v-show="false" ref="file">
			</group>
      <group title="个人信息">
        <x-input title="登录名" v-model="user.name" placeholder="请填写登录名" text-align="right" ref="run"></x-input>
        <x-input title="密码" v-model="user.password" placeholder="请填写密码" text-align="right" ref="rpw" type="password"></x-input>
        <x-input title="真实名" v-model="user.realname" placeholder="请填写真实名" text-align="right" ref="rrn"></x-input>
        <x-input title="手机号" v-model="user.phone" placeholder="请填写手机号" text-align="right" ref="rp"></x-input>
      </group>
       <group title="参与者权限">
        <checklist v-model="user.Roles" :max="1" :options="Roles" label-position="left"></checklist>
      </group>
		</div>
    <div style="padding: 15px;">
      <x-button type="primary" @click.native="submit">注册</x-button>
      <div style="text-align:center;">
      <a href="#/login">前往登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, XInput, Cell, Checklist, XButton } from "vux";
export default {
  name: "profile",
  components: {
    XHeader,
    Group,
    XInput,
    Cell,
    Checklist,
    XButton
  },
  data() {
    return {
      IsEdit: false,
      Roles: [],
      user: {
        name: "",
        password: "",
        realname: "",
        phone: "",
        Roles: [],
        img: require("@/assets/icon/avatar-male.png")
      },
      role: {
        name: "",
        description: "",
        duty: ""
      },
      fuJuShangMenList: [],
      index: 0,
      images: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$api.getRoles({ forFuJuShangMen: true }).then(res => {
        //this.Roles = res;
        for (let i = 0; i < res.length; i++) {
          if (i < 2) {
            this.Roles.push(res[i]);
          } else {
            break;
          }
        }
      });
    },
    imageChoose() {
      this.$refs.file.click();
    },
    imageChange(e) {
      let $target = e.target || e.dataTransfer || e.srcElement;
      if (!$target.files.length) return;
      let file = $target.files[0];
      let url = this.getObjectURL(file);
      this.imageUpload(file).then(data => {
        this.user.img = url;
      });
    },
    imageUpload(file) {
      let formData = new FormData();
      formData.append("file", file);
      return this.$http.post("File", formData);
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    async submit() {
      var msg = "";
      if (true) {
        //登录名
        if (this.user.name.trim() === "") {
          msg = this.$refs.run.title + "必填哦";
        } else {
          if (this.user.password.trim() === "") {
            //密码
            msg = this.$refs.rpw.title + "必填哦";
          } else {
            if (this.user.realname.trim() === "") {
              //真实姓名
              msg = this.$refs.rrn.title + "必填哦";
            } else {
              //手机号
              if (this.user.phone.trim() === "") {
                msg = this.$refs.rp.title + "必填哦";
              } else {
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!reg.test(this.user.phone)) {
                  msg = this.$refs.rp.title + "格式不正确";
                } else {
                  let list = await this.$http.get("Users");
                  for (let i = 0; i < list.length; i++) {
                    if (
                      list[i].Phone === this.user.phone &&
                      list[i].ID != this.user.id
                    ) {
                      msg = this.$refs.rp.title + "已存在！";
                    }
                  }
                }
              }
            }
          }
        }
        if (msg === "") {
          if (this.user.Roles.length === 0) {
            msg = "请选择用户权限！";
          }
        }
      }
      if (msg === "") {
        var newUser = {
          UserName: this.user.name,
          Password: this.user.password,
          RealName: this.user.realname,
          Phone: this.user.phone,
          RoleID: this.user.Roles[0],
          Img: this.user.img
        };
        this.$http.post("Users", newUser).then(r => {
          this.$utils.Alert("注册成功");
          this.$router.push("/login");
        });
        // this.$http.put("ChangeUser", newUser).then(r => {
        //   this.$router.push("/profile");
        // });
      } else {
        this.$utils.Alert("错误", msg);
      }
    },
    newHeaderImage(newImg) {
      this.headerImage = newImg;
    }
  },
  computed: {},
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paddingbottom {
  padding-bottom: 20px;
}
.me .infos {
  text-align: center;
  font-size: 17px;
}
.me .avatar {
  margin-top: 30px;
  margin-bottom: 10px;
  width: 70px;
  height: 70px;
  display: inline-block;
  overflow: hidden;
  position: relative;
}
img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.avatar-wrapper {
  position: relative;
}
.imageUpload {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
}
.me .nickname {
  margin-top: 16px;
}
.me .edit {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
}
.me .infos-flex-item {
  display: -webkit-flex;
  display: -webkit-box;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-justify-content: center;
  -webkit-box-pack: center;
  justify-content: center;
  text-align: center;
}
.me .infos-flex {
  padding: 10px 0;
}
</style>
