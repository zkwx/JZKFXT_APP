<template>
  <div>
    <div v-if="!sign">
      <group title="康复人员信息登记表" label-width="7em" label-margin-right="1em" >
        <x-input title="姓名" v-model="Disabled.Name" required ref="Name" :readonly="isEdit"></x-input>
        <selector title="性别" placeholder="请选择性别" v-model="Disabled.Sex" required ref="Sex" :options="Sexlist" :readonly="isEdit"></selector>
        <x-input title="监护人" v-model="Disabled.Guardian" required ref="Guardian" :readonly="isEdit"></x-input>
        <selector title="与残疾人关系" placeholder="请选择关系" v-model="Disabled.RelationshipID" required ref="RelationshipID" :options="RelationshipList" :readonly="isEdit"></selector>
        <x-input title="联系电话" v-model="Disabled.Tel" required ref="Tel" type="tel" :max="13" :readonly="isEdit"></x-input>
        <x-switch title="有无残疾证" v-model="Disabled.HasCertificate" :disabled="isEdit"></x-switch>
        <x-input title="残疾证号" v-model="Disabled.Certificate" required ref="Certificate" type="number" :min="20" :max="21" v-if="Disabled.HasCertificate" :readonly="isEdit"></x-input>
        <x-input title="身份证号" v-model="Disabled.IDNumber" required ref="IDNumber" type="number" :min="18" :max="18" v-if="!Disabled.HasCertificate" :readonly="isEdit"></x-input>
        <x-input title="年龄" :value="age" Disabled ref="Age" :readonly="true"></x-input>
        <checklist title="残疾类别" v-model="Disabled.Categories" required :disabled="!canChoose" ref="Categories" :options="Categories" label-position="left" :max="this.Disabled.CategoryID===7?6:1"></checklist>
        <x-switch title="有无康复需求" v-model="Disabled.Need" :disabled="isEdit"></x-switch>
      </group>
      <group>
        <group title="视力" v-if="Disabled.Categories.indexOf(1) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="视力残疾等级" :readonly="!canChoose" placeholder="请选择残疾等级" v-model="Disabled.Disabled_Details[0].DegreeID" :options="Degrees" direction="right" required ref="VisionDegreeID"></selector>
          <popup-picker v-show="isView" title="康复需求" v-if="Disabled.Need" v-model="Disabled.Disabled_Details[0].RehabilitationIDs" :data="Lists.VisionList" :columns="2" :column-width="[1/3]" required ref="VisionRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <cell v-show="!isView" title="康复需求" :value="$refs.VisionRehabilitationIDs&&$refs.VisionRehabilitationIDs.getNameValues()"></cell>
          <selector title="服务走向" v-if="Disabled.Need" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[0].NextID" :options="Nexts" direction="right" required ref="VisionNextID"></selector>
        </group>
        <group title="听力" v-if="Disabled.Categories.indexOf(2) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="听力残疾等级" :readonly="!canChoose" placeholder="请选择残疾等级" v-model="Disabled.Disabled_Details[1].DegreeID" :options="Degrees" direction="right" required ref="HearingDegreeID"></selector>
          <popup-picker v-show="isView" v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[1].RehabilitationIDs" :data="Lists.HearingList" :columns="2" :column-width="[1/3]" required ref="HearingRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <cell v-show="!isView" title="康复需求" :value="$refs.HearingRehabilitationIDs&&$refs.HearingRehabilitationIDs.getNameValues()"></cell>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[1].NextID" :options="Nexts" direction="right" required ref="HearingNextID"></selector>
        </group>
        <group title="言语" v-if="Disabled.Categories.indexOf(3) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="言语残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[2].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="SpeakingDegreeID"></selector>
        </group>
        <group title="肢体" v-if="Disabled.Categories.indexOf(4) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="肢体残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[3].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="BodyDegreeID"></selector>
          <popup-picker v-show="isView" v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[3].RehabilitationIDs" :data="Lists.BodyList" :columns="2" :column-width="[1/3]" required ref="BodyRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <cell v-show="!isView" title="康复需求" :value="$refs.BodyRehabilitationIDs&&$refs.BodyRehabilitationIDs.getNameValues()"></cell>
          <selector v-if="Disabled.Need" title="服务走向" v-model="Disabled.Disabled_Details[3].NextID" :options="Nexts" direction="right" required ref="BodyNextID"></selector>
        </group>
        <group title="智力" v-if="Disabled.Categories.indexOf(5) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="智力残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[4].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="IntelligenceDegreeID"></selector>
          <popup-picker v-show="isView" v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[4].RehabilitationIDs" :data="Lists.IntelligenceList" :columns="2" :column-width="[1/3]" required ref="IntelligenceRehabilitationIDs" show-name value-text-align="left"></popup-picker>
           <cell v-show="!isView" title="康复需求" :value="$refs.IntelligenceRehabilitationIDs&&$refs.IntelligenceRehabilitationIDs.getNameValues()"></cell>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[4].NextID" :options="Nexts" direction="right" required ref="IntelligenceNextID"></selector>
        </group>
        <group title="精神" v-if="Disabled.Categories.indexOf(6) !== -1" label-width="7em" label-margin-right="2em">
          <selector title="精神残疾等级" :readonly="!canChoose" v-model="Disabled.Disabled_Details[5].DegreeID" placeholder="请选择残疾等级" :options="Degrees" direction="right" required ref="SpiritDegreeID"></selector>
          <popup-picker v-show="isView" v-if="Disabled.Need" title="康复需求" v-model="Disabled.Disabled_Details[5].RehabilitationIDs" :data="Lists.SpiritList" :columns="2" :column-width="[1/3]" required ref="SpiritRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <cell v-show="!isView" title="康复需求" :value="$refs.SpiritRehabilitationIDs&&$refs.SpiritRehabilitationIDs.getNameValues()"></cell>
          <selector v-if="Disabled.Need" title="服务走向" placeholder="请选择服务走向" v-model="Disabled.Disabled_Details[5].NextID" :options="Nexts" direction="right" required ref="SpiritNextID"></selector>
        </group>
      </group>

            <div v-show="!fin">
         <div class="weui-cells__title">辅具列表</div>
        <div>
           <group>
            <div v-for="(name,assistive) in conditions" :key="assistive">
            <!-- 一级目录 -->
              <cell :title='name' is-link :border-intent="false" :arrow-direction="showContent[name] ? 'up' : 'down'" @click.native="showContent[name] = !showContent[name]">
                  <badge :text='changeNumber(name)'></badge>
              </cell>
              <template v-if="showContent[name]">
               <!-- 二级目录 -->
                <div v-for="(twoName,assistivet) in  changeTwoAssistive(name)" :key="assistivet" style="padding-left:10px;">
                <cell :title='twoName.value' is-link :border-intent="false" :arrow-direction="showContent[twoName.value] ? 'up' : 'down'" @click.native="showContent[twoName.value] = !showContent[twoName.value]">
                  <badge :text='changeTwoNumber(twoName.key)'></badge>
                </cell>
                <template v-if="showContent[twoName.value]">
                  <!-- 三级目录 -->
                   <div v-for="(threeName,assistivet) in  changeThreeAssistive(twoName.key)" :key="assistivet" style="padding-left:10px;">
                <cell :title='threeName.value' is-link :border-intent="false" :arrow-direction="showContent[threeName.value] ? 'up' : 'down'" @click.native="showContent[threeName.value] = !showContent[threeName.value]">
                  <badge :text='changeThreeNumber(threeName.key)'></badge>
                </cell>
                <template v-if="showContent[threeName.value]">
                    <div>
                    <div class="weui-cells weui-cells_checkbox">
                    <div v-for="(item,assistive) in changeFourAssistive(threeName.key)" :key="assistive">
                      <label class="weui-cell weui-check_label">
                          <div class="weui-cell__hd">
                            <input type="checkbox" class="weui-check" :value="item.key" v-model="currentValue" :disabled="IsCheck">
                            <i class="weui-icon-checked vux-checklist-icon-checked"></i>
                          </div>
                          <div style="width:50%"> 
                            <img :src="item.img" style="width:100%"/>
                          </div>
                          <div class="weui-cell__bd" style="text-align: center;">
                          <p v-html="item.value"></p>
                          <p v-html="'单价：'+item.price+'元'"></p>
                        </div>
                      </label>
                       <group title="描述">
                        <x-textarea readonly :value="item.comment" :autosize="true"></x-textarea>
                      </group>
                     <app-number :disabledID="disabledID" :state="State" :examID="examID" :item="item" :jian="item.key" :title="item.value" :display="assistiveDisabled" @on-change="numberChange"></app-number>
                  </div>
                </div>
               </div> 
                </template>
                <!-- 三级目录 -->
                   </div>
                </template>
                <!-- 二级目录 -->
              </div>
          </template>
          <!-- 一级目录 -->
              </div>
            </group>
              <div>
                 <group>
                      <cell title="总价" :value="total"></cell>
                      <cell-form-preview :list="valueList"></cell-form-preview>
                  </group>
              </div>
              
        </div>

      </div>

      <div style="padding: 0 15px;">
        <x-button type="primary" @click.native="submit" :disabled="save">保存</x-button>
         <x-button type="primary" @click.native="finish" :disabled="fin">完成</x-button>
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
  Cell,
  CellBox,
  Badge,
  PopupPicker,
  InlineXNumber,
  CellFormPreview,
  XTextarea
} from "vux";
import AppSign from "@/components/AppSign";
import AppNumber from "@/components/AppNumber";
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
    AppSign,
    AppNumber,
    Cell,
    CellBox,
    Badge,
    InlineXNumber,
    CellFormPreview,
    XTextarea
  },
  props: {
    disabledID: String,
    examID: String,
    state: String
  },
  data() {
    return {
      changeCN: [],
      valueList: [],
      sign: false,
      isEdit: true,
      isView: true,
      total: 0,
      nextID: 0,
      sf: false,
      State: this.state,
      assistiveDevices: [], //所有辅具
      assistiveName: [], //辅具选择
      conditions: [], //辅具类型
      showContent: {},
      currentValue: [], //辅具选择
      currentNumber: [],
      twoAssistive: [],
      threeAssistive: [],
      imageUrl: "",
      assistNumber: [],
      assistiveAnswer: [],
      img: require("@/assets/icon/暂无图片.jpg"),
      image: "",
      UserID: null,
      save: true,
      fin: true,
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
        UserSignUrl: "",
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
    async initData() {
      //绑定人员基本信息
      if (this.Disabled.ID) {
        this.getDisabled(this.Disabled.ID);
      } else {
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
      await this.$api.getAllAssistives().then(r => {
        this.assistiveDevices = r;
      });
      //文件当前路径
      this.imageUrl = await this.$api.getAssistUrl();
      await this.$api
        .getAssistiveAnswers(
          "?ExamID=" + this.examID + "&disabledID=" + this.Disabled.ID
        )
        .then(r => {
          for (let i = 0; i < r.length; i++) {
            this.total = this.total + r[i].Total;
            if (this.currentValue.indexOf(r[i].ID) === -1) {
              this.currentValue.push(r[i].ID);
              this.currentNumber.push({
                id: r[i].ID,
                name: r[i].Name,
                number: r[i].Number
              });
            }
            if (this.conditions.indexOf(r[i].Type) === -1) {
              this.conditions.push(r[i].Type);
            }
          }
        });
      await this.getAsssistive();
      if (this.currentValue.length > 0) {
        this.fin = false;
        for (let a = 0; a < this.assistiveName.length; a++) {
          for (let b = 0; b < this.currentNumber.length; b++) {
            if (this.assistiveName[a].key === this.currentNumber[b].id) {
              this.valueList.push({
                label: this.assistiveName[a].value,
                value:
                  "数量：" +
                  this.currentNumber[b].number +
                  ",总价：" +
                  this.currentNumber[b].number * this.assistiveName[a].price
              });
            }
          }
        }
      }
    },

    async getAsssistive() {
      if (this.conditions.length > 0) {
        let content = this.pure(this.showContent);
        let twoFlag = true;
        let threeFlag = true;
        for (let a = 0; a < this.conditions.length; a++) {
          let cond = this.conditions[a];
          if (content[cond] != false) {
            content[cond] = false;
          }
        }
        for (let b = 0; b < this.currentValue.length; b++) {
          if (this.currentValue[b].toString().length === 9) {
            let four = await this.$api.getAssistiveDevice(this.currentValue[b]);
            let three = await this.$api.getAssistiveDevice(
              four.ParentAssistiveDeviceID
            );
            let two = await this.$api.getAssistiveDevice(
              three.ParentAssistiveDeviceID
            );
            if (content[two.Name] != false) {
              content[two.Name] = false;
            }
            if (content[three.Name] != false) {
              content[three.Name] = false;
            }
            if (this.twoAssistive.length === 0) {
              this.twoAssistive.push({
                id: two.ID,
                name: two.Name,
                type: two.Type
              });
            } else {
              for (let tw = 0; tw < this.twoAssistive.length; tw++) {
                if (this.twoAssistive[tw].id === two.ID) {
                  twoFlag = false;
                } else {
                  twoFlag = true;
                }
              }
              if (twoFlag) {
                this.twoAssistive.push({
                  id: twox.ID,
                  name: twox.Name,
                  type: twox.Type
                });
              }
            }

            if (this.threeAssistive.length === 0) {
              this.threeAssistive.push({
                id: three.ID,
                parent: three.ParentAssistiveDeviceID,
                name: three.Name,
                type: three.Type
              });
            } else {
              for (let th = 0; th < this.threeAssistive.length; th++) {
                if (this.threeAssistive[th].id === three.ID) {
                  threeFlag = false;
                } else {
                  threeFlag = true;
                }
              }
              if (threeFlag) {
                this.threeAssistive.push({
                  id: three.ID,
                  parent: three.ParentAssistiveDeviceID,
                  name: three.Name,
                  type: three.Type
                });
              }
            }
          } else {
            continue;
          }
        }
        this.showContent = content;

        for (let c = 0; c < this.conditions.length; c++) {
          for (let d = 0; d < this.assistiveDevices.length; d++) {
            let ast = this.assistiveDevices[d];
            if (
              this.conditions[c] === ast.Type &&
              this.currentValue.indexOf(ast.ID) > -1
            ) {
              this.image = this.imageUrl + ast.PicName;

              //辅具名称
              this.assistiveName.push({
                key: ast.ID,
                value: ast.Name,
                type: ast.Type,
                img: this.image,
                parent: ast.ParentAssistiveDeviceID,
                price: ast.Price,
                comment: ast.Comments
              });
            }
          }
        }
      }
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
            item.NextID = 2;
            details[item.CategoryID - 1] = item;
          }
        });
        r.Disabled_Details = details;
        _this.Disabled = r;
        this.$api
          .getExamRecord(
            "?ExamID=" +
              _this.Disabled.Categories[0] +
              "&DisabledID=" +
              _this.Disabled.ID +
              "&First=0"
          )
          .then(r => {
            if (r.State != 4) {
              this.save = false;
            }
          });
      });
    },
    change(val, label) {
      console.log("change", val, label);
    },
    async submit() {
      //表单验证
      if (false) {
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
            this.Disabled.Categories.forEach(function(item, i) {
              let detail = _this.Disabled.Disabled_Details[item - 1];
              if (!detail.DegreeID) {
                msg =
                  this.$refs.HearingDegreeID.title +
                  (this.$refs.HearingDegreeID.firstError == null
                    ? "必填哦"
                    : this.$refs.HearingDegreeID.firstError);
              } else if (!detail.RehabilitationID) {
                msg =
                  this.$refs.HearingRehabilitationIDs.title +
                  (this.$refs.HearingRehabilitationIDs.firstError == null
                    ? "必填哦"
                    : this.$refs.HearingRehabilitationIDs.firstError);
              } else if (!detail.NextID) {
                msg =
                  this.$refs.HearingNextID.title +
                  (this.$refs.HearingNextID.firstError == null
                    ? "必填哦"
                    : this.$refs.HearingNextID.firstError);
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

      if (!this.Disabled.ID) {
        //选择身份证号后选择的残疾类别和等级
        if (this.Disabled.Categories === []) {
          this.Disabled.Categories = this.$refs.Categories;
        }
        if (this.Disabled.CategoryID === null) {
          this.Disabled.CategoryID = this.$refs.Categories.currentValue[0];
        }
        if (this.Disabled.DegreeID === null) {
          this.Disabled.DegreeID = this.$refs.VisionDegreeID.currentValue;
        }
        const Disabled = await this.$http.post("Disableds", this.Disabled);
        this.Disabled.ID = Disabled.ID;
        this.sign = true;
        this.$utils.Alert("保存成功");
        _that.$router.push("/ZongHeKangFuHome");
      } else {
        // await this.$http.put("Disableds/" + this.Disabled.ID, this.Disabled);

        for (let n = 0; n < this.Disabled.Disabled_Details.length; n++) {
          const next = this.Disabled.Disabled_Details[n];
          if (next != null) {
            this.nextID = next.NextID;
          }
        }
        this.sf = false;
        this.sign = true;
      }
    },

    async finish() {
      this.sf = true;
      this.sign = true;
    },

    async successSignCallback(response) {
      this.Disabled.UserSignUrl = this.$refs.sign.signImage;
      let flag;
      let parName = {
        disabledID: this.Disabled.ID,
        userSignUrl: this.Disabled.UserSignUrl
      };
      await this.$http.get("Disableds/SaveUserSign", parName).then(r => {
        flag = r;
      });
      if (flag === this.Disabled.ID) {
        if (this.sf) {
          //完成
          let userKey = localStorage.getItem("loginUserBaseInfo");
          var obj = JSON.parse(userKey);
          this.UserID = obj.I;
          this.$api
            .postExamRecord(
              "?ExamID=" +
                this.examID +
                "&DisabledID=" +
                this.Disabled.ID +
                "&UserID=" +
                this.UserID
            )
            .then(r => {
              this.$utils.Alert("保存成功");
              this.$router.push("/ZongHeKangFuHome");
            });
        } else {
          //转存
          let param =
            "?examID=" +
            this.examID +
            "&disabledID=" +
            this.Disabled.ID +
            "&nextID=" +
            this.nextID;
          await this.$http.put("ExamRecords/ChangeExamNext" + param).then(r => {
            this.$utils.Alert("保存成功");
            this.$router.push("/ZongHeKangFuHome");
          });
        }
      }
    },
    changeNumber(type) {
      let index = 0;
      let list = [];
      for (let i = 0; i < this.assistiveName.length; i++) {
        let assist = this.assistiveName[i];
        if (type === assist.type) {
          list.push(assist.key);
        } else {
          continue;
        }
      }
      if (this.currentValue.length > 0) {
        for (let j = 0; j < this.currentValue.length; j++) {
          for (let i = 0; i < list.length; i++) {
            if (list[i] === this.currentValue[j]) {
              index += 1;
            }
          }
        }
      } else {
        index = 0;
      }
      return index;
    },

    //辅具二级目录
    changeTwoAssistive(type) {
      let list = [];
      for (let i = 0; i < this.twoAssistive.length; i++) {
        let two = this.twoAssistive[i];
        if (type === two.type) {
          list.push({
            key: two.id,
            value: two.name,
            type: two.type
          });
        }
      }
      return list;
    },
    //辅具三级目录
    changeThreeAssistive(value) {
      let tlist = [];
      for (let i = 0; i < this.threeAssistive.length; i++) {
        let three = this.threeAssistive[i];
        if (value === three.parent) {
          tlist.push({
            key: three.id,
            value: three.name,
            type: three.type
          });
        }
      }
      return tlist;
    },
    //辅具列表
    changeFourAssistive(value) {
      let fList = [];
      for (let i = 0; i < this.assistiveName.length; i++) {
        let t = this.assistiveName[i];
        if (value === t.parent) {
          fList.push({
            key: t.key,
            value: t.value,
            type: t.type,
            img: t.img,
            comment:t.comment,
            price: t.price
          });
        }
      }
      return fList;
    },
    changeTwoNumber(value) {
      let index = 0;
      for (let i = 0; i < this.currentValue.length; i++) {
        if (this.currentValue[i].toString().length === 9) {
          if (this.currentValue[i].toString().indexOf(value) > -1) {
            index += 1;
          }
        }
      }
      return index;
    },
    changeThreeNumber(value) {
      let index = 0;
      for (let i = 0; i < this.currentValue.length; i++) {
        if (this.currentValue[i].toString().length === 9) {
          if (this.currentValue[i].toString().indexOf(value) > -1) {
            index += 1;
          }
        }
      }
      return index;
    },
    numberChange(title, jian, number) {
      this.assistNumber.push(number);
      let flag = false;
      if (this.currentNumber.length > 0) {
        for (let i = 0; i < this.currentNumber.length; i++) {
          if (this.currentNumber[i].id == jian) {
            this.currentNumber[i].number = number;
            flag = true;
            break;
          }
        }
      } else {
        this.currentNumber.push({
          id: jian,
          name: title,
          number: number
        });
        flag = true;
      }

      if (!flag) {
        this.currentNumber.push({
          id: jian,
          name: title,
          number: number
        });
      }
    },
    pure(obj) {
      return JSON.parse(JSON.stringify(obj));
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
      // return !this.Disabled.HasCertificate || this.Disabled.CategoryID === 7;
      return false;
    },
    //辅具是否可选
    IsCheck() {
      return true;
    },
    //数量增减按钮
    assistiveDisabled() {
      return false;
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
