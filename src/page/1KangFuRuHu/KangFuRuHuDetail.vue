<template>
  <div>
    <div v-if="!sign">
      <group title="康复人员信息登记表" label-width="7em" label-margin-right="1em" >
        <x-input title="姓名" v-model="Disabled.Name" required ref="Name"></x-input>
        <selector title="性别" placeholder="请选择性别" v-model="Disabled.Sex" required ref="Sex" :options="Sexlist"></selector>
        <x-input title="监护人" v-model="Disabled.Guardian" required ref="Guardian"></x-input>
        <selector title="与残疾人关系" placeholder="请选择关系" v-model="Disabled.RelationshipID" required ref="RelationshipID" :options="RelationshipList"></selector>
        <x-input title="联系电话" v-model="Disabled.Tel" required ref="Tel" type="tel" :max="13"></x-input>
        <x-switch title="有无残疾证" v-model="Disabled.HasCertificate"></x-switch>
        <x-input title="残疾证号" v-model="Disabled.Certificate" required ref="Certificate" type="number" :min="20" :max="21" v-if="Disabled.HasCertificate"></x-input>
        <x-input title="身份证号" v-model="Disabled.IDNumber" required ref="IDNumber" type="number" :min="18" :max="18" v-if="!Disabled.HasCertificate"></x-input>
        <x-input title="年龄" :value="age" Disabled ref="Age" :readonly="true"></x-input>
        <checklist title="残疾类别" v-model="Disabled.Categories" required :disabled="!canChoose" ref="Categories" :options="Categories" label-position="left" :max="this.Disabled.CategoryID===7?6:1"></checklist>
        <x-switch title="有无康复需求" v-model="Disabled.Need"></x-switch>
      </group>
      <group>
        <group title="视力" v-if="Disabled.Categories.indexOf(1) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="视力残疾等级" :readonly="!canChoose" placeholder="请选择残疾等级" v-model="Disabled.Disabled_Details[0].DegreeID" :options="Degrees" direction="right" required ref="VisionDegreeID"></selector>
          <popup-picker title="康复需求" v-if="Disabled.Need" v-model="Disabled.Disabled_Details[0].RehabilitationIDs" :data="Lists.VisionList" :columns="2" :column-width="[1/3]" required ref="VisionRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector title="服务走向" v-if="Disabled.Need" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[0].NextID" :options="Nexts" direction="right" required ref="VisionNextID"></selector>
        </group>
        <group title="听力" v-if="Disabled.Categories.indexOf(2) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="听力残疾等级" :readonly="!canChoose" placeholder="请选择残疾等级" v-model="Disabled.Disabled_Details[1].DegreeID" :options="Degrees" direction="right" required ref="HearingDegreeID"></selector>
          <popup-picker v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[1].RehabilitationIDs" :data="Lists.HearingList" :columns="2" :column-width="[1/3]" required ref="HearingRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[1].NextID" :options="Nexts" direction="right" required ref="HearingNextID"></selector>
        </group>
        <group title="言语" v-if="Disabled.Categories.indexOf(3) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="言语残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[2].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="SpeakingDegreeID"></selector>
        </group>
        <group title="肢体" v-if="Disabled.Categories.indexOf(4) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="肢体残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[3].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="BodyDegreeID"></selector>
          <popup-picker v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[3].RehabilitationIDs" :data="Lists.BodyList" :columns="2" :column-width="[1/3]" required ref="BodyRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[3].NextID" :options="Nexts" direction="right" required ref="BodyNextID"></selector>
        </group>
        <group title="智力" v-if="Disabled.Categories.indexOf(5) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="智力残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[4].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="IntelligenceDegreeID"></selector>
          <popup-picker v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[4].RehabilitationIDs" :data="Lists.IntelligenceList" :columns="2" :column-width="[1/3]" required ref="IntelligenceRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[4].NextID" :options="Nexts" direction="right" required ref="IntelligenceNextID"></selector>
        </group>
        <group title="精神" v-if="Disabled.Categories.indexOf(6) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="精神残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[5].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="SpiritDegreeID"></selector>
          <popup-picker v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[5].RehabilitationIDs" :data="Lists.SpiritList" :columns="2" :column-width="[1/3]" required ref="SpiritRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[5].NextID" :options="Nexts" direction="right" required ref="SpiritNextID"></selector>
        </group>
      </group>
      <div style="padding: 0 15px;">
        <x-button type="primary" @click.native="submit" :disabled="isSave">保存</x-button>
        <x-button type="primary" @click.native="remove" :disabled="isDele">删除</x-button>
      </div>
    </div>
    <app-sign v-if="sign" :DisabledID="Disabled.ID" @success="successSignCallback" ref="sign"></app-sign>
  </div>
</template>

<script>
import {
  XHeader,
  Group,
  XInput,
  Checklist,
  Selector,
  XSwitch,
  XButton,
  PopupPicker
} from "vux";
import AppSign from "@/components/AppSign";
import { isDate } from "util";
export default {
  name: "KangFuRuHuDetail",
  components: {
    XHeader,
    Group,
    XInput,
    Checklist,
    Selector,
    XSwitch,
    XButton,
    PopupPicker,
    AppSign
  },
  props: {
    disabledID: String
  },
  data() {
    return {
      sign: false,
      isSave: false,
      isDele: false,
      Sexlist: [{ key: 1, value: "男" }, { key: 2, value: "女" }],
      RelationshipList: [
        { key: 1, value: "父母" },
        { key: 2, value: "配偶" },
        { key: 3, value: "兄弟姐妹" },
        { key: 4, value: "祖父母" },
        { key: 5, value: "其他" }
      ],
      Categories: [],
      Degrees: [],
      Nexts: [],
      Lists: {
        VisionList: [],
        HearingList: [],
        BodyList: [],
        IntelligenceList: [],
        SpiritList: []
      },
      DefaultDetails: [
        {
          ID: null,
          CategoryID: 1,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        },
        {
          ID: null,
          CategoryID: 2,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        },
        {
          ID: null,
          CategoryID: 3,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        },
        {
          ID: null,
          CategoryID: 4,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        },
        {
          ID: null,
          CategoryID: 5,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        },
        {
          ID: null,
          CategoryID: 6,
          DegreeID: null,
          RehabilitationIDs: [],
          RehabilitationID: null,
          NextID: null
        }
      ],
      Disabled: {
        ID: null,
        Name: "",
        Sex: null,
        Tel: "",
        Guardian: "",
        RelationshipID: null,
        HasCertificate: true,
        Certificate: "",
        IDNumber: "",
        CategoryID: null,
        DegreeID: null,
        Categories: [],
        Need: true,
        DoorService: "",
        DisabledSignUrl: "",
        SecondSign: "",
        UserID: "",
        Disabled_Details: []
      }
    };
  },
  created() {
    this.Disabled.ID = this.disabledID;
    this.initData();
  },
  methods: {
    initData() {
      //绑定人员基本信息
      if (this.Disabled.ID) {
        this.getDisabled(this.Disabled.ID);
      } else {
        this.isDele = true;
        this.Disabled.Disabled_Details = this.DefaultDetails;
      }
      //填充选项列表
      this.$api.getCategories().then(r => {
        r.pop();
        this.Categories = r;
      });
      this.$api.getDegrees().then(r => {
        this.Degrees = r;
      });
      this.$api.getRehabilitationData().then(r => {
        this.Lists = r;
      });
      this.$api.getNexts().then(r => {
        this.Nexts = r;
      });
    },
    getDisabled(id) {
      var _this = this;
      this.$api.getDisabled(id).then(r => {
        let details = this.DefaultDetails.slice();
        r.Categories = [];
        r.Disabled_Details.forEach(function(item, i) {
          if (item) {
            r.Categories.push(item.CategoryID);
            if (item.RehabilitationID) {
              item.RehabilitationIDs = [
                item.RehabilitationID.toString().substr(0, 5),
                item.RehabilitationID.toString()
              ];
            }
            details[item.CategoryID - 1] = item;
          }
        });
        r.Disabled_Details = details;
        _this.Disabled = r;
        if (_this.Disabled.Categories[0] === 4) {
          //3、偏瘫  4、脑瘫  5、脊髓  6、肢体综合
          var eid = [3, 4, 5, 6];
          for (let a = 0; a < eid.length; a++) {
            this.$api
              .getExamRecord(
                "?ExamID=" + eid[a] + "&disabledID=" + _this.Disabled.ID
              )
              .then(r => {
                if (r.State > 0) {
                  this.isSave = true;
                  this.isDele = true;
                }
              });
          }
        } else {
          this.$api
            .getExamRecord(
              "?ExamID=" +
                _this.Disabled.Categories[0] +
                "&disabledID=" +
                _this.Disabled.ID
            )
            .then(r => {
              if (r.State > 0) {
                this.isSave = true;
                this.isDele = true;
              }
            });
        }
      });
    },
    change(val, label) {
      console.log("change", val, label);
    },
    async remove() {
      var num = await this.$http.delete("Disableds/" + this.Disabled.ID);
      if (num === this.Disabled.ID) {
        this.$utils.Alert("删除失败", "该患者无法删除!");
      } else {
        this.$utils.Alert("删除成功", "该患者已删除!");
        this.$router.push("/KangFuRuHuHome");
      }
    },
    async submit() {
      //表单验证
      if (true) {
        var msg = "";
        //患者姓名
        if (!this.$refs.Name.valid || this.$refs.Name.value == "") {
          msg =
            this.$refs.Name.title +
            (this.$refs.Name.firstError == null
              ? "必填哦"
              : this.$refs.Name.firstError == ""
                ? "必填哦"
                : this.$refs.Name.firstError);
        } else if (this.$refs.Sex.getFullValue() == null) {
          //患者性别
          msg = this.$refs.Sex.title + "必选哦";
        } else if (
          !this.$refs.Guardian.valid ||
          this.$refs.Guardian.value == ""
        ) {
          //监护人
          msg =
            this.$refs.Guardian.title +
            (this.$refs.Guardian.firstError == null
              ? "必填哦"
              : this.$refs.Guardian.firstError == ""
                ? "必填哦"
                : this.$refs.Guardian.firstError);
        } else if (this.$refs.RelationshipID.getFullValue() == null) {
          //监护人与患者的关系
          msg = this.$refs.RelationshipID.title + "必选哦";
        } else if (!this.$refs.Tel.valid || this.$refs.Tel.value == "") {
          //患者联系电话
          msg =
            this.$refs.Tel.title +
            (this.$refs.Tel.firstError == null
              ? "必填哦"
              : this.$refs.Tel.firstError == ""
                ? "必填哦"
                : this.$refs.Tel.firstError);
        } else if (this.$refs.Tel.value != "") {
          //患者联系电话格式
          var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
          if (!reg.test(this.$refs.Tel.value)) {
            msg = this.$refs.Tel.title + "格式不正确";
          }
        }

        if (msg == "") {
          var am = this.$refs.Age.value;
          //判断选择(残疾证号/身份证号)
          if (this.Disabled.HasCertificate) {
            //验证残疾证号
            if (
              !this.$refs.Certificate.valid ||
              this.$refs.Certificate.value == ""
            ) {
              msg =
                this.$refs.Certificate.title +
                (this.$refs.Certificate.firstError == null
                  ? "必填哦"
                  : this.$refs.Certificate.firstError == ""
                    ? "必填哦"
                    : this.$refs.Certificate.firstError);
            } else {
              if (typeof am != "number") {
                msg = this.$refs.Age.value;
              }
            }
          } else {
            //验证身份证号
            if (!this.$refs.IDNumber.valid || this.$refs.IDNumber.value == "") {
              msg =
                this.$refs.IDNumber.title +
                (this.$refs.IDNumber.firstError == null
                  ? "必填哦"
                  : this.$refs.IDNumber.firstError == ""
                    ? "必填哦"
                    : this.$refs.IDNumber.firstError);
            } else {
              if (typeof am != "number") {
                msg = this.$refs.Age.value;
              }
            }
          }
        }
        if (msg == "") {
          if (!this.$refs.Categories.valid) {
            msg =
              this.$refs.Categories.title +
              (this.$refs.Categories.firstError == null
                ? "必填哦"
                : this.$refs.Categories.firstError);
          } else {
            var _this = this;
            _this.Disabled.Categories.forEach(function(item, i) {
              let detail = _this.Disabled.Disabled_Details[item - 1];
              if (!detail.DegreeID) {
                // msg =
                //   this.$refs.HearingDegreeID.title +
                //   (this.$refs.HearingDegreeID.firstError == null
                //     ? "必填哦"
                //     : this.$refs.HearingDegreeID.firstError);
                msg = "残疾等级必填！";
              } else if (!detail.RehabilitationID) {
                // msg =
                //   this.$refs.HearingRehabilitationIDs.title +
                //   (this.$refs.HearingRehabilitationIDs.firstError == null
                //     ? "必填哦"
                //     : this.$refs.HearingRehabilitationIDs.firstError);
                msg = "康复需求必填！";
              } else if (!detail.NextID) {
                // msg =
                //   this.$refs.HearingNextID.title +
                //   (this.$refs.HearingNextID.firstError == null
                //     ? "必填哦"
                //     : this.$refs.HearingNextID.firstError);
                msg = "服务走向必填！";
              }
            });
          }
        }

        if (msg != "") {
          this.$utils.Alert("保存失败", msg);
          return;
        }
      }
      var _that = this;
      //如果未选择，清空后传入后台更新
      for (let i = 0; i < 6; i++) {
        if (this.Disabled.Categories.indexOf(i + 1) === -1) {
          this.Disabled.Disabled_Details[i] = null;
        }
      }
      let userKey = localStorage.getItem("loginUserBaseInfo");
      var obj = JSON.parse(userKey);
      this.Disabled.UserID = obj.I;
      if (!this.Disabled.ID) {
        //选择身份证号后选择的残疾类别和等级
        if (this.Disabled.Categories === []) {
          this.Disabled.Categories = this.$refs.Categories;
        }
        if (this.Disabled.CategoryID === null) {
          this.Disabled.CategoryID = this.$refs.Categories.currentValue[0];
        }
        if (this.Disabled.DegreeID === null) {
          //this.Disabled.DegreeID = this.$refs.VisionDegreeID.currentValue;
          for (let i = 0; i < this.Disabled.Disabled_Details.length; i++) {
            if (this.Disabled.Disabled_Details[i] != null) {
              this.Disabled.DegreeID = this.Disabled.Disabled_Details[
                i
              ].DegreeID;
            }
          }
        }
        const Disabled = await this.$http.post("Disableds", this.Disabled);
        this.Disabled.ID = Disabled.ID;
        this.sign = true;
        this.$utils.Alert("保存成功");
        _that.$router.push("/KangFuRuHuHome");
      } else {
        if (this.Disabled.Categories[0] != this.Disabled.CategoryID) {
          this.Disabled.CategoryID = this.Disabled.Categories[0];
        }
        await this.$http.put("Disableds/" + this.Disabled.ID, this.Disabled);
        this.sign = true;
      }
    },
    async successSignCallback(response) {
      this.Disabled.DisabledSignUrl = this.$refs.sign.signImage;
      if (!this.Disabled.ID) {
        await this.$http.post("Disableds", this.Disabled).then(r => {
          this.$utils.Alert("保存成功");
          this.$router.push("/KangFuRuHuHome");
        });
      } else {
        await this.$http
          .put("Disableds/" + this.Disabled.ID, this.Disabled)
          .then(r => {
            this.$utils.Alert("保存成功");
            this.$router.push("/KangFuRuHuHome");
          });
      }
    }
  },
  computed: {
    //年龄计算
    age() {
      let age = this.$utils.CalcAge(
        this.Disabled.HasCertificate,
        this.Disabled.Certificate,
        this.Disabled.IDNumber
      );
      return age;
    },
    canChoose() {
      return !this.Disabled.HasCertificate || this.Disabled.CategoryID === 7;
    }
  },
  watch: {
    //根据残疾证号选择残疾类别和等级
    "Disabled.Certificate"() {
      if (!this.Disabled.HasCertificate) return;
      if (this.Disabled.Certificate.length < 20) return;
      let a = this.$utils.CalcCategoryDegree(this.Disabled.Certificate);
      if (a != null) {
        this.Disabled.CategoryID = a.category;
        this.Disabled.DegreeID = a.degree;
        if (a.category !== 7) {
          this.Disabled.Categories.push(a.category);
          this.Disabled.Disabled_Details[a.category - 1].DegreeID = a.degree;
        }
      } else {
        this.Disabled.Categories = [];
        this.Disabled.CategoryID = null;
        this.Disabled.DegreeID = null;
      }
    },

    //提取多列选择器的选项
    "Disabled.Disabled_Details": {
      handler: function(val, oldVal) {
        this.Disabled.Disabled_Details.forEach(element => {
          if (element.RehabilitationIDs.length > 0) {
            element.RehabilitationID = element.RehabilitationIDs[1];
          }
        });
      },
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  padding-left: 15px;
  line-height: 28px;
  color: #888;
  font-size: 12px;
}
select {
  text-align: right;
}
</style>
