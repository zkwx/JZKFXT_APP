<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar" @click="imageChoose">
            <img :src="user.Img">
            <img class="imageUpload" src="../assets/icon/imageUpload.png">
          </div>
          <p>{{user.RealName}}</p>
          <div class="paddingbottom"></div>
          <input type="file" accept="image" @change="imageChange" v-show="false" ref="file">
			</group>
      <group title="个人信息">
        <x-input title="姓名" v-model="user.RealName" text-align="right" ref="cn"></x-input>
         <selector title="性别" v-model="user.Sex" ref="Sex" :options="Sexlist"></selector>
        <x-input title="手机号" v-model="user.Phone" text-align="right" ref="cp"></x-input>
        <x-input title="身份证号" v-model="user.IDNumber" text-align="right" ref="cin"></x-input>
       <x-address title="地址" v-model="Addresses" :list="addressData" placeholder="请选择地址" value-text-align="right"></x-address>
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
  Selector,
  XAddress,
  ChinaAddressV4Data
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
    Selector,
    XAddress,
    ChinaAddressV4Data
  },
  data() {
    return {
      IsEdit: false,
      Roles: [],
      Sexlist: [{ key: 1, value: "男" }, { key: 2, value: "女" }],
      user: {
        ID: "",
        UserName: "",
        RealName: "",
        Phone: "",
        Sex: null,
        IDNumber: "",
        RoleID: null,
        Address: null,
        Address: [],
        //Roles: [1, 2],
        Img: require("@/assets/icon/avatar-male.png")
      },
      role: {
        name: "",
        description: "",
        duty: ""
      },
      Addresses: [],
      fuJuShangMenList: [],
      index: 0,
      images: [],
      addressData: ChinaAddressV4Data
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const userKey = localStorage.getItem("loginUserBaseInfo");
      var obj = JSON.parse(userKey);
      var uid = obj.I;
      await this.$api.getUser(uid).then(r => {
        this.user.ID = r.ID;
        this.user.UserName = r.UserName;
        //用户姓名(真实姓名)
        this.user.RealName = r.RealName;
        //用户电话
        this.user.Phone = r.Phone;
        this.user.Sex = r.Sex;
        this.user.IDNumber = r.IDNumber;
        this.user.RoleID = r.RoleID;
        //用户地址
        if (r.Addresses != null) {
          this.Addresses = [
            this.user.Address.slice(0, 2) + "0000",
            this.user.Address.slice(0, 4) + "00",
            this.user.Address
          ];
        }
        //头像
        if (r.Img != "") {
          this.user.Img = r.Img;
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
        this.user.Img = data;
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
                  list[i].ID != this.user.ID
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
                  li[i].ID != this.user.ID
                ) {
                  msg = this.$refs.cin.title + "已存在！";
                }
              }
            }
          }
        }
        if (msg === "") {
          if (this.Addresses.length === 0) {
            msg = "请填写地址！";
          }
        }
      }
      if (msg === "") {
        this.user.Address = this.Addresses[2];
        this.$http.put("Users/" + this.user.ID, this.user).then(r => {
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
