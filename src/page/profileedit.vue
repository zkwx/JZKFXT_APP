<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar" @click="imageChoose">
            <img :src="user.img">
            <img class="imageUpload" src="../assets/icon/imageUpload.png">
          </div>
          <p>{{user.name}}</p>
          <div class="paddingbottom"></div>
          <input type="file" accept="image" @change="imageChange" v-show="false" ref="file">
			</group>
      <group title="个人信息">
        <x-input title="姓名" v-model="user.realName" text-align="right" ref="cn"></x-input>
         <selector title="性别" v-model="user.sex" ref="Sex" :options="Sexlist"></selector>
        <x-input title="手机号" v-model="user.phone" text-align="right" ref="cp"></x-input>
        <x-input title="身份证号" v-model="user.idNumber" text-align="right" ref="cin"></x-input>
      </group>
      <!-- 
      <group title="参与者权限">
        <checklist v-model="user.Roles" :options="Roles" label-position="left"></checklist>
      </group>  
      <group title="角色">
				<cell title="角色">{{role.name}}</cell>
			</group> -->
		</div>
    <div style="padding: 15px;">
      <x-button type="primary" @click.native="submit">保存</x-button>
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
  data() {
    return {
      IsEdit: false,
      Roles: [],
      Sexlist: [{ key: 1, value: "男" }, { key: 2, value: "女" }],
      user: {
        id: "",
        realName: "",
        phone: "",
        sex: null,
        idNumber: "",
        roleID: null,
        //Roles: [1, 2],
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
      const userKey = localStorage.getItem("loginUserBaseInfo");
      var obj = JSON.parse(userKey);
      var uid = obj.I;
      this.$api.getUser(uid).then(r => {
        this.user.id = r.ID;
        //用户姓名
        this.user.realName = r.RealName;
        //用户电话
        this.user.phone = r.Phone;
        this.user.sex = r.Sex;
        this.user.idNumber = r.IDNumber;
        this.user.roleID = r.RoleID;
        //头像
        if (r.Img != "") {
          this.user.img = r.Img;
        }
        //用户角色
        this.$api.getRole(r.RoleID).then(r => {
          this.role.name = r.RoleName;
          this.role.description = r.Description;
          this.role.duty = r.Duty;
        });
      });
      //this.$api.getRoles({forFuJuShangMen:true}).then(res => { this.Roles = res })
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
        //this.user.img = url;
        this.user.img = data;
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
        if (this.$refs.cn.value.trim() === "") {
          msg = this.$refs.cn.title + "必填哦";
        } else {
          if (this.$refs.cp.value.trim() === "") {
            msg = this.$refs.cp.title + "必填哦";
          } else {
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(this.$refs.cp.value.trim())) {
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
        if (msg === "") {
          //身份证号
          if (this.$refs.cin.value.trim() === "") {
            msg = this.$refs.cin.title + "必填哦";
          } else {
            var rid = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
            if (!rid.test(this.$refs.cin.value.trim())) {
              msg = this.$refs.cin.title + "格式不正确";
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
      }
      if (msg === "") {
        // var newUser = {
        //   ID: this.user.id,
        //   RealName: this.$refs.cn.value,
        //   phone: this.$refs.cp.value,
        //   Img: this.user.img
        // };
        this.$http.put("ChangeUser", this.user).then(r => {
          this.$router.push("/profile");
        });
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
