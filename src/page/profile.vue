<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar">
            <img :src="user.Img">
          </div>
					<p>{{user.RealName}}</p>
          <p>{{user.Phone}}</p>
           <router-link to="/profile/all" class="guan" v-show="all">管理</router-link>
          <router-link to="/profile/edit" class="edit">设置</router-link>
					<!-- <flexbox :gutter="0" class="infos-flex" v-show="isShow">
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>1</p>
								<label>1</label>
							</div>
						</flexbox-item>
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>2</p>
								<label>2</label>
							</div>
						</flexbox-item>
					</flexbox> -->
			</group>
			<group title="角色" >
				<cell title="角色">{{role.name}}</cell>
        <div v-show="false">
          <x-address title="地址" v-model="Addresses" :list="addressData" placeholder="请选择地址" value-text-align="right"></x-address>
        </div>
        <cell title="区域" :value="getName(Addresses)"></cell>
			</group>
    
			<group title="描述">
				<!-- <checklist v-model="user.Roles" :options="Roles" disabled label-position="left"></checklist> -->
				<cell value-align="left">{{role.description}}</cell>
      </group>
      <group title="职责">
				<cell value-align="left">{{role.duty}}</cell>
      </group>
		</div>
  </div>
</template>

<script>
import {
  XHeader,
  Group,
  Flexbox,
  FlexboxItem,
  Cell,
  Checklist,
  XButton,
  XAddress,
  ChinaAddressV4Data,
  Value2nameFilter as value2name
} from "vux";
export default {
  name: "profile",
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Checklist,
    XButton,
    XAddress,
    ChinaAddressV4Data
  },
  data() {
    return {
      //Roles: [],
      value: [],
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
      isShow: false,
      Addresses: [],
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
      let id = obj.I;
      let role = obj.R;
      await this.$api.getUser(id).then(r => {
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
        if (r.Address != null) {
          this.Addresses = [
            r.Address.slice(0, 2) + "0000",
            r.Address.slice(0, 4) + "00",
            r.Address
          ];
        }
        //头像
        if (r.Img != "") {
          this.user.Img = r.Img;
        }
        //用户角色
        this.$api.getRole(this.user.RoleID).then(r => {
          this.role.name = r.RoleName;
          this.role.description = r.Description;
          this.role.duty = r.Duty;
        });
      });
      //参与者权限
      // this.$api.getRoles({ forFuJuShangMen: true }).then(res => {
      //   this.Roles = res.slice(0, 2);
      // });
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    }
  },
  computed: {
    all() {
      if (this.user.RoleID === 12) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  color: #09bb07;
  position: absolute;
  top: 12px;
  right: 12px;
}
.me .guan {
  color: #09bb07;
  position: absolute;
  top: 12px;
  right: 50px;
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
