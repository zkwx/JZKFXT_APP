<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar">
            <img :src="user.img">
          </div>
					<p>{{user.name}}</p>
          <p>{{user.phone}}</p>
          <router-link to="/profile/edit" class="edit">设置</router-link>
					<flexbox :gutter="0" class="infos-flex">
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>{{disabled.conduct}}</p>
								<label>{{disabled.conVal}}</label>
							</div>
						</flexbox-item>
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>{{disabled.finish}}</p>
								<label>{{disabled.finVal}}</label>
							</div>
						</flexbox-item>
					</flexbox>
			</group>
			<group title="角色">
				<cell title="角色">{{role.name}}</cell>
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
  XButton
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
    XButton
  },
  data() {
    return {
      //Roles: [],
      user: {
        name: "",
        phone: "",
        real: "",
        roleID: "",
        //Roles: [1, 2],
        img: require("@/assets/icon/avatar-male.png")
      },
      disabled: {
        conduct: "",
        conVal: "",
        finish: "",
        finVal: ""
      },
      role: {
        name: "",
        description: "",
        duty: ""
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const userKey = localStorage.getItem("loginUserBaseInfo");
      var obj = JSON.parse(userKey);
      let id = obj.I;
      let role = obj.R;
      this.$api.getUser(id).then(r => {
        this.user.name = r.RealName;
        //用户电话
        this.user.phone = r.Phone;
        this.user.roleID = r.RoleID;
        //头像
        if (r.Other != "") {
          this.user.img = r.Other;
        }
        //用户角色
        this.$api.getRole(this.user.roleID).then(r => {
          this.role.name = r.RoleName;
          this.role.description = r.Description;
          this.role.duty = r.Duty;
        });
      });
      if (role < 3) {
        this.disabled.conVal = "进行中患者";
        this.disabled.finVal = "已完成患者";
      } else if (role > 2 && role < 10) {
        this.disabled.conVal = "待审核患者";
        this.disabled.finVal = "已审核患者";
      } else if (role > 9) {
        this.disabled.conVal = "待完成患者";
        this.disabled.finVal = "已完成患者";
      }
      var user = {
        id: id,
        role: role
      };
      this.$api.getConduct(user).then(r => {
        if (r > 0) {
          this.disabled.conduct = r;
        } else {
          this.disabled.conduct = r.data;
        }
      });
      this.$api.getFinish(user).then(x => {
        if (x > 0) {
          this.disabled.finish = x;
        } else {
          this.disabled.finish = x.data;
        }
      });
      //参与者权限
      // this.$api.getRoles({ forFuJuShangMen: true }).then(res => {
      //   this.Roles = res.slice(0, 2);
      // });
    }
  },
  computed: {},
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
