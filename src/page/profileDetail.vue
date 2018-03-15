<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
         <div class="avatar" @click="imageChoose">
            <img :src="user.img">
            <img class="imageUpload" src="../assets/icon/imageUpload.png">
          </div>
          <p>{{user.realName}}</p>
          <div class="paddingbottom"></div>
          <input type="file" accept="image" @change="imageChange" v-show="false" ref="file">
			</group>
      <group title="个人信息">
        <x-input title="登录名" v-model="user.userName" text-align="right" ref="cun" :readonly="!IsEdit"></x-input>
         <x-input title="密码" v-model="user.password" text-align="right" ref="cpw" v-show="isView"></x-input>
        <x-input title="姓名" v-model="user.realName" text-align="right" ref="crn"></x-input>
       <selector title="性别" placeholder="请选择性别" v-model="user.sex" required ref="Sex" :options="Sexlist"></selector>
        <x-input title="手机号" v-model="user.phone" text-align="right" ref="cp"></x-input>
        <x-input title="身份证号" v-model="user.idNumber" text-align="right" ref="cin"></x-input>
        <x-input title="年龄" :value="age" Disabled ref="Age" :readonly="true" text-align="right"></x-input>
      </group>
      <!-- <group title="角色与区域">
        <cell title="角色">管理员</cell>
        <cell title="区域">江苏省-徐州市-铜山区</cell>
      </group>-->
      <group title="参与者权限">
        <checklist title="权限" v-model="user.Roles" :max="1" :options="Roles" label-position="left" ref="re"></checklist>
      </group> 
		</div>
    <div style="padding: 15px;">
      <x-button type="primary" @click.native="submit">保存</x-button>
       <!-- <x-button type="primary" @click.native="del">删除</x-button> -->
    </div>
  </div>
</template>

<script>
import {
  XHeader,
  Group,
  XInput,
  Cell,
  Checklist,
  XButton,
  Selector
} from "vux";
export default {
  name: "profile",
  components: {
    XHeader,
    Group,
    XInput,
    Cell,
    Checklist,
    XButton,
    Selector
  },
  props: {
    userID: String
  },
  data() {
    return {
      IsEdit: false,
      isView: false,
      Sexlist: [{ key: 1, value: "男" }, { key: 2, value: "女" }],
      Roles: [],
      user: {
        id: "",
        userName: "",
        password: "",
        realName: "",
        sex: null,
        phone: "",
        idNumber: "",
        Roles: [],
        roleID: null,
        img: require("@/assets/icon/avatar-male.png")
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
      var uid = this.userID;
      if (uid) {
        this.$api.getUser(uid).then(r => {
          this.user.id = r.ID;
          //登录名
          this.user.userName = r.UserName;
          //用户真实姓名
          this.user.realName = r.RealName;
          //用户电话
          this.user.phone = r.Phone;
          //性别
          this.user.sex = r.Sex;
          //身份证号
          this.user.idNumber = r.IDNumber;
          //权限
          this.user.Roles.push(r.RoleID);
          //头像
          if (r.Img != "") {
            this.user.img = r.Img;
          }
        });
        this.$api.getRoles({ forFuJuShangMen: true }).then(res => {
          this.Roles = res;
        });
      } else {
        this.IsEdit = true;
        this.isView = true;
        this.$api.getRoles({ forFuJuShangMen: true }).then(res => {
          this.Roles = res;
        });
      }
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
        if (!this.userID) {
          if (this.$refs.cun.value.trim() === "") {
            msg = this.$refs.cun.title + "必填哦";
          } else {
            if (this.$refs.cpw.value.trim() === "") {
              msg = this.$refs.cpw.title + "必填哦";
            }
          }
        }
        if (msg === "") {
          //姓名
          if (this.$refs.crn.value.trim() === "") {
            msg = this.$refs.crn.title + "必填哦";
          } else {
            if (this.$refs.Sex.getFullValue() == null) {
              msg = this.$refs.Sex.title + "必选哦";
            } else {
              //手机号
              if (this.$refs.cp.value.trim() === "") {
                msg = this.$refs.cp.title + "必填哦";
              } else {
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!reg.test(this.$refs.cp.value)) {
                  msg = this.$refs.cp.title + "格式不正确";
                } else {
                  let list = await this.$http.get("Users");
                  for (let i = 0; i < list.length; i++) {
                    if (
                      list[i].Phone === this.$refs.cp.value &&
                      list[i].ID != this.user.id
                    ) {
                      msg = this.$refs.cp.title + "已存在！";
                    }
                  }
                }
              }
            }
          }
        }
        if (msg === "") {
          //身份证号
          if (this.$refs.cin.value.trim() === "") {
            msg = this.$refs.cin.title + "必填哦";
          } else {
            let li = await this.$http.get("Users");
            for (let i = 0; i < li.length; i++) {
              if (
                li[i].IDNumber === this.$refs.cin.value &&
                li[i].ID != this.user.id
              ) {
                msg = this.$refs.cin.title + "已存在！";
              }
            }
          }
        }
      }
      if (msg === "") {
        if (!this.userID) {
          if (this.$refs.re.getFullValue().length === 0) {
            msg = this.$refs.re.title + "必选哦";
          } else {
            this.user.roleID = this.user.Roles[0];
          }
        } else {
          this.user.roleID = this.user.Roles[0];
        }
      }
      if (msg === "") {
        if (!this.userID) {
          var addUser = {
            UserName: this.user.userName,
            Password: this.user.password,
            RealName: this.user.realName,
            Phone: this.user.phone,
            RoleID: this.user.roleID,
            Sex: this.user.sex,
            IDNumber: this.user.idNumber,
            Img: this.user.img
          };
          this.$http.post("Users", addUser).then(r => {
            this.$router.push("/profile/all");
          });
        } else {
          this.$http.put("ChangeUser", this.user).then(r => {
            this.$router.push("/profile/all");
          });
        }
      } else {
        this.$utils.Alert("错误", msg);
      }
    },
    //删除该用户
    // del() {
    //   this.$http.delete("DeleteUser", this.userID).then(r => {

    //     this.$utils.Alert("删除成功");
    //     this.$router.push("/profile/all");
    //   });
    // },
    newHeaderImage(newImg) {
      this.headerImage = newImg;
    }
  },
  computed: {
    age() {
      let age = this.$utils.CalcAge(false, "", this.user.idNumber);
      return age;
    }
  },
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
