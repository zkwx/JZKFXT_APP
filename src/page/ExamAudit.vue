<template>
  <div>
    <group title="评估适配系统" label-width="6em" label-margin-right="1em">
      <x-input title="姓名" v-model="disabled.Name" required :disabled="IsView"></x-input>
      <selector title="性别" v-model="disabled.Sex" required :options="Sexlist" :readonly="IsView"></selector>
      <x-switch title="有无残疾证" v-model="disabled.HasCertificate" :disabled="IsView"></x-switch>
      <x-input title="残疾证号" v-model="disabled.Certificate" required :min="20" :max="21" v-if="disabled.HasCertificate" :disabled="IsView"></x-input>
      <x-input title="身份证号" v-model="disabled.IDNumber" required :min="18" :max="18" v-if="!disabled.HasCertificate" :disabled="IsView"></x-input>
      <x-input title="年龄" :value="age" disabled></x-input>
      <selector title="残疾类别" v-model="disabled.CategoryID" required :options="Categories" :readonly="IsView"></selector>
      <selector title="残疾等级" v-model="disabled.DegreeID" required :options="Degrees" direction="right" :readonly="IsView"></selector>
      <datetime title="致残时间" v-model="disabled.data" value-text-align="left" :disabled="IsView" :readonly="IsView"></datetime>
      <selector title="致残原因" v-model="disabled.DisabilityReason" required :options="DisabilityReasons" :readonly="IsView"></selector>
      <x-input title="民族" v-model="disabled.Nation" :disabled="IsView"></x-input>
      <x-input title="身高" v-model="disabled.Height" :disabled="IsView"></x-input>
      <x-input title="体重" v-model="disabled.Weight" :disabled="IsView"></x-input>
      <x-input title="联系电话" v-model="disabled.Tel" :disabled="IsView"></x-input>
      <x-input title="Email" v-model="disabled.Email" :disabled="IsView"></x-input>
      <div v-show="!IsView">
      <x-address title="地址" v-model="Addresses" :list="addressData" placeholder="请选择地址" value-text-align="left" :disabled="IsView"></x-address>
  </div>
   <div v-show="IsView">
 <cell title="区域" :value="getName(Addresses)"></cell>
 </div>
    </group>
  <div>
    <div v-if="showQuestion || IsView">
      <div v-for="(questions,examID) in exams" :key="examID">
        <div v-for="(question,QuestionNo) in questions" :key="QuestionNo">
          <app-checklist v-show="question.show" required :examID="examID" :ref="'checklist'+examID+QuestionNo" :question="question" :questions="questions" :options="question.Options" label-position="left" :max="question.Type===1?1:question.Type===8?3:10" @on-change="optionChange" :disabled="IsView"></app-checklist>
        </div>
      </div>
    </div>
    <div v-show="showAssistiveDevicesTable || IsView">
      <div class="weui-cells__title">辅具列表</div>
      <div>
        <div class="weui-cells__title" id="assistiveType"></div>
        <div>
          <group>
              <div v-for="(name,assistive) in conditions" :key="assistive">
                <cell :title='name' is-link :border-intent="false" :arrow-direction="showContent[name] ? 'up' : 'down'" @click.native="showContent[name] = !showContent[name]">
                  <badge :text='changeNumber(name)'></badge>
                </cell>
                <template v-if="showContent[name]">
                  <div>
                    <div class="weui-cells weui-cells_checkbox">
                    <div v-for="(item,assistive) in changeAssistive(name)" :key="assistive">
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
                       <app-number :disabledID="disabledID" :examID="examID" :item="item" :jian="item.key" :title="item.value" :display="assistiveDisabled" @on-change="numberChange"></app-number>
                  </div>
                </div>
               </div>
                </template>
              </div>
            </group>

              <div>
                  <group>
                     <x-input title="总价" v-model="total"  text-align="center" :disabled="true"></x-input>
                  </group>
              </div>


        </div>
        <div v-if="!showView">
        <x-button type="primary"  @click.native="examChange"  :disabled="canAdopt">修改</x-button>
        <x-button type="primary"  @click.native="examNext"  :disabled="canAdopt">通过</x-button>
        <x-button type="primary"  @click.native="examBack" :disabled="canAdopt">未通过</x-button>
        </div>
        <div v-if="showView">
           <x-button type="primary" :disabled="true">已通过审核</x-button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Vue from "vue";
import AppChecklist from "@/components/AppChecklist";
import AppNumber from "@/components/AppNumber";
import {
  XHeader,
  Group,
  XInput,
  Checklist,
  Selector,
  XSwitch,
  XButton,
  PopupPicker,
  Datetime,
  XAddress,
  ChinaAddressV4Data,
  CheckIcon,
  XDialog,
  TransferDomDirective as TransferDom,
  Divider,
  Flexbox,
  FlexboxItem,
  XTable,
  Cell,
  CellBox,
  Badge,
  Value2nameFilter as value2name
} from "vux";
import { userInfo } from "os";
export default {
  name: "FuJuPingGuDetail",
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    XInput,
    Checklist,
    Selector,
    XSwitch,
    XButton,
    PopupPicker,
    Datetime,
    XAddress,
    ChinaAddressV4Data,
    CheckIcon,
    XDialog,
    Divider,
    Flexbox,
    FlexboxItem,
    XTable,
    AppChecklist,
    Cell,
    CellBox,
    Badge,
    AppNumber
  },
  props: {
    disabledID: String,
    examID: String,
    state: String
  },
  data() {
    return {
      total: 0,
      showNumber: false,
      showContent: {},
      showQuestion: true,
      State: this.state,
      exams: {}, //{examID,questions}
      questionManager: {
        questionsFlow: [], //{examID,questionNo,options}
        questionLast: [], //{examID,questionNo,options}  存放跳转试卷后原试卷剩下的题
        currentQuestionsFlowIndex: 0
      },
      Sexlist: [{ key: 1, value: "男" }, { key: 2, value: "女" }],
      RelationshipList: [
        { key: 1, value: "父母" },
        { key: 2, value: "配偶" },
        { key: 3, value: "兄弟姐妹" },
        { key: 4, value: "祖父母" },
        { key: 5, value: "其他" }
      ],
      Categories: [],
      Degrees: [
        { key: 1, value: "一级" },
        { key: 2, value: "二级" },
        { key: 3, value: "三级" },
        { key: 4, value: "四级" },
        { key: 5, value: "未定级" }
      ],
      DisabilityReasons: [],
      addressData: ChinaAddressV4Data,
      Addresses: [],
      Agree: false,
      showScrollBox: false,
      showAssistiveDevicesTable: false,
      Questions: {},
      NextQuestionNo: null,
      assistiveDevices: [],
      conditions: [], //选择筛选辅具的类型
      assistiveName: [], //筛选之后的辅具名称(用来选择)
      assistiveChange: [], //筛选之后的辅具集合
      currentValue: [], //辅具选择
      currentNumber: [],
      assistNumber: [],
      disabled: {
        ID: null,
        Name: "",
        Sex: null,
        Tel: "",
        Address: [],
        HasCertificate: true,
        Certificate: "",
        IDNumber: "",
        CategoryID: null,
        DegreeID: null,
        Nation: "",
        Height: null,
        Weight: null,
        Email: "",
        Address: null,
        disabled_Details: []
      },
      IsCheck: false,
      img: require("@/assets/icon/暂无图片.jpg"),
      image: ""
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.disabled.ID = this.disabledID;
      //填充选项列表
      this.Categories = await this.$api.getCategories();
      this.Degrees = await this.$api.getDegrees();
      //动态绑定致残原因
      this.DisabilityReasons = await this.$api.getDisabilityReasons(2);
      if (this.disabled.ID != null) {
        this.getDisabled(this.disabled.ID);
      }
      await this.initQuestions();

      if (this.IsView) {
        await this.loadAssistiveDevices();
        await this.loadCheckAssistive();
        for (let i = 0; i < this.conditions.length; i++) {
          this.changeNumber(this.conditions[i]);
        }
      }
      //辅具是否可选
      if (this.State != "1") {
        this.IsCheck = true;
      }
    },
    //地址
    async getDisabled(ID) {
      this.disabled = await this.$api.getDisabled(ID);
      this.disabled.disabled_Details = null;
      if (this.disabled.Address) {
        this.Addresses = [
          this.disabled.Address.slice(0, 2) + "0000",
          this.disabled.Address.slice(0, 4) + "00",
          this.disabled.Address
        ];
      }
    },
    //初始化问题
    async initQuestions() {
      await this.bindExams(this.examID);

      //重新答题时，遍历答过的题目，清空选项
      if (this.questionManager.questionsFlow.length > 1) {
        for (const question of this.questionManager.questionsFlow) {
          const currentChecklist =
            "checklist" + this.examID + question.questionNo;
          this.$refs[currentChecklist][0].currentValue = [];
        }
      }

      this.questionManager.questionsFlow = [];
      this.questionManager.questionsFlow.push({
        examID: this.examID,
        questionNo: "1",
        messages: ""
      });
      this.questionManager.currentQuestionsFlowIndex = 0;
      this.getCurrentQuestion().show = true;
      this.assistiveDevices = [];
    },
    //获取当前试卷
    getCurrentExam() {
      const exam = this.questionManager.questionsFlow[
        this.questionManager.currentQuestionsFlowIndex
      ];
      return exam;
    },
    //获取当前问题
    getCurrentQuestion() {
      const exam = this.questionManager.questionsFlow[
        this.questionManager.currentQuestionsFlowIndex
      ];
      const questions = this.exams[exam.examID];
      const question = questions[exam.questionNo];
      return question;
    },
    //获取当前选项
    getCurrentChecklist() {
      const exam = this.questionManager.questionsFlow[
        this.questionManager.currentQuestionsFlowIndex
      ];
      const currentChecklist = "checklist" + exam.examID + exam.questionNo;
      return this.$refs[currentChecklist][0];
    },
    //选项变化
    optionChange(examID, questionNo, optionIds, type) {
      if (!this.IsView) {
        if (optionIds.length > 0) {
          if (type === 1) {
            const checked = this.getCurrentChecklist();
            const question = this.getCurrentQuestion();
            if (
              question.QueryOptions[checked.currentValue[0]].NextQuestionNo !=
                null ||
              this.questionManager.questionLast.length > 0
            ) {
              this.ToNext();
            }
            return;
          }
          if (type === 4) {
            this.clearOption();
            return;
          }
          if (type === 6) {
            this.disability();
            return;
          }
        }
        if (type === 4) {
          this.clearNoOption(examID, questionNo);
          return;
        }
        if (type === 6) {
          this.noDisability(examID, questionNo);
          return;
        }
      }
    },
    //没有选择时
    noDisability(examID, questionNo) {
      const questions = this.exams[examID];
      const question = questions[questionNo];
      for (const opid of question.Options) {
        opid.show = true;
      }
    },
    //根据残疾部位限制选择
    disability() {
      const question = this.getCurrentQuestion();
      const checklist = this.getCurrentChecklist();
      //最大的数值
      let gradeMax = 0;
      //选择的选项数值
      let gradeList = [];
      //遍历选项数组获取最大的数值
      for (const o of question.Options) {
        const option = question.QueryOptions[o.key];
        const grade1 = option.Grade;
        if (grade1 > gradeMax) {
          gradeMax = grade1;
        }
      }
      //添加选择的选项的数值
      for (const i in checklist.currentValue) {
        const option = question.QueryOptions[checklist.currentValue[i]];
        const grade2 = option.Grade;
        gradeList.push(grade2);
      }
      //判断数值（上肢区间：gradeMax(包含)--gradeMax/2(不包含),下肢区间：gradeMax/2(包含)--）
      for (const j in gradeList) {
        //选择的数值
        const gl = gradeList[j];
        for (const p of question.Options) {
          const opt = question.QueryOptions[p.key];
          const grade3 = opt.Grade;
          //上肢区间
          if (gl > gradeMax / 2) {
            if (grade3 > gradeMax / 2) {
              if (grade3 < gl) {
                p.show = false;
              } else {
                p.show = true;
              }
            }
          } else if (grade3 <= gradeMax / 2) {
            //下肢区间
            if (grade3 < gl) {
              p.show = false;
            } else {
              p.show = true;
            }
          }
        }
      }

      if (gradeList.length === 1) {
        if (gradeList[0] > gradeMax / 2) {
          for (const pt1 of question.Options) {
            const ot = question.QueryOptions[pt1.key];
            const gd = ot.Grade;
            if (gd <= gradeMax / 2) {
              pt1.show = true;
            }
          }
        } else {
          for (const pt2 of question.Options) {
            const ot = question.QueryOptions[pt2.key];
            const gd = ot.Grade;
            if (gd > gradeMax / 2) {
              pt2.show = true;
            }
          }
        }
      }

      //选择一项后，又选择上一项，去掉下一项
      for (const j in checklist.currentValue) {
        const checkOpt = checklist.currentValue[j];
        for (const k in question.Options) {
          const qt = question.Options[k];
          const grades = question.QueryOptions[qt.key].Grade;
          if (qt.key === checkOpt) {
            if (!qt.show) {
              checklist.currentValue.splice(j, 1);
            }
          }
        }
      }
    },
    //选择下的选择清空选项
    clearNoOption(examID, questionNo) {
      const questions = this.exams[examID];
      const question = questions[questionNo];
      const currentChecklist = "checklist" + examID + questionNo;
      const sublist = this.$refs[currentChecklist][0];
      if (sublist.currentSubValue.length > 0) {
        sublist.currentSubValue = [];
      }
    },
    clearOption() {
      const question = this.getCurrentQuestion();
      const checklist = this.getCurrentChecklist();
      if (question.Type === 4) {
        for (const optionID of question.Options) {
          const option = question.QueryOptions[optionID.key];
          const NextQuestionNo = option.NextQuestionNo;
          //获取下一题选项
          const exam = this.questionManager.questionsFlow[
            this.questionManager.currentQuestionsFlowIndex
          ];
          const questions = this.exams[exam.examID];
          const nextQuestion = questions[NextQuestionNo];
          if (checklist.currentValue.indexOf(optionID.key) === -1) {
            if (optionID.value.indexOf("其他") > -1) {
              checklist.messages = "";
            } else {
              for (const nextOption of nextQuestion.Options) {
                for (let i = 0; i < checklist.currentSubValue.length; i++) {
                  if (checklist.currentSubValue[i] === nextOption.key) {
                    checklist.currentSubValue.splice(i, 1);
                  }
                }
              }
            }
          }
        }
      }
    },
    //上一题
    Previous() {
      const question = this.getCurrentQuestion();
      const checklist = this.getCurrentChecklist();
      question.show = false;
      checklist.currentValue = [];
      let index = 0;
      this.questionManager.questionsFlow.splice(
        this.questionManager.currentQuestionsFlowIndex,
        this.questionManager.questionsFlow.length -
          this.questionManager.currentQuestionsFlowIndex
      );
      this.questionManager.currentQuestionsFlowIndex--;
      const questionPrevious = this.getCurrentQuestion();
      questionPrevious.show = true;
    },
    //下一题
    async ToNext() {
      const exam = this.getCurrentExam();
      const checklist = this.getCurrentChecklist();
      const question = this.getCurrentQuestion();
      for (const optionID of checklist.currentValue) {
        const option = question.QueryOptions[optionID];
        const NextQuestionNo = option.NextQuestionNo;
        //从一张试卷跳到另一张试卷
        if (option.NextExamID != 0) {
          if (option.NextExamID != parseInt(exam.examID)) {
            //当前试卷试题
            const questions = this.exams[exam.examID];

            //原试卷剩余的问题
            for (const i in questions) {
              if (questions[i].QuestionNo > question.QuestionNo) {
                this.questionManager.questionLast.push({
                  examID: exam.examID,
                  questionNo: questions[i].QuestionNo,
                  messages: checklist.messages
                });
              }
            }
            question.show = false;
            //根据试卷ID查找问题
            await this.bindExams(option.NextExamID);
            //新试卷的第一题
            const first = this.exams[option.NextExamID][1];
            //跳转到新试卷的第一题
            NextQuestionNo = first.QuestionNo;
          }
        }
        //跳回原试卷
        if (question.Type != 4 && NextQuestionNo === null) {
          if (this.State === "0") {
            if (this.questionManager.questionLast.length > 0) {
              option.NextExamID = parseInt(this.examID);
              NextQuestionNo = this.questionManager.questionLast[0].questionNo;
              this.questionManager.questionLast = [];
            }
          }
        }
        if (question.Type != 4 && NextQuestionNo) {
          if (this.State === "0") {
            //多选题两个选项跳同一个题目时
            if (
              this.questionManager.questionsFlow[
                this.questionManager.questionsFlow.length - 1
              ].questionNo != NextQuestionNo
            ) {
              if (option.NextExamID != 0) {
                this.questionManager.questionsFlow.push({
                  examID: option.NextExamID.toString(),
                  questionNo: NextQuestionNo,
                  messages: checklist.messages
                });
              } else {
                this.questionManager.questionsFlow.push({
                  examID: checklist.examID,
                  questionNo: NextQuestionNo,
                  messages: checklist.messages
                });
              }
            }
          }
        }
      }
      const examQuestion = this.questionManager.questionsFlow[
        this.questionManager.currentQuestionsFlowIndex
      ];

      if (this.State === "0") {
        if (question.Type === 4) {
          examQuestion.options = checklist.currentValue.concat(
            checklist.currentSubValue
          );
        } else {
          examQuestion.options = checklist.currentValue;
        }
      }

      examQuestion.messages = checklist.messages;

      question.show = false;

      this.questionManager.currentQuestionsFlowIndex++;
      const questionNext = this.getCurrentQuestion();
      if (questionNext) {
        questionNext.show = true;
      }
    },
    async bindExams(ExamID) {
      const Exam = await this.$api.getExam(ExamID);
      let exams = this.pure(this.exams);
      exams[ExamID] = Exam.Questions;
      this.exams = exams;
    },
    //重新答题
    Reset() {
      this.initQuestions();
    },
    setCurrentQuestionID(val, lable) {
      this.currentQuestionID = val;
    },
    submit() {
      var _this = this;
      this.disabled.Address = this.Addresses[2];
      if (!this.disabled.ID) {
        this.$http.post("disableds", this.disabled).then(r => {
          let result = r;
          if (!_this.targetExamName) {
            if (!_this.disabled.CategoryID) {
              $utils.Alert("评估出错", "残疾类型有误");
              return;
            }
            _this.targetExamName =
              _this.Categories[_this.disabled.CategoryID - 1].value;
          }
          _this.initQuestions();
          _this.showScrollBox = true;
        });
      } else {
        this.$http
          .put("disableds/" + this.disabled.ID, this.disabled)
          .then(r => {
            let result = r;
            _this.initQuestions();
            _this.showScrollBox = true;
          });
      }
    },
    //根据答案查找辅具
    async loadAssistiveDevices(answers) {
      //所有辅具
      const assistives = await this.$api.getAllAssistives();
      //所有辅具类型
      const assistivesType = [];
      for (const t of assistives) {
        if (assistivesType.indexOf(t.Type) === -1) {
          assistivesType.push(t.Type);
        }
      }
      //数据库查询答案
      if (!answers) {
        answers = await this.$api.getAnswers(
          "?ExamID=" + this.examID + "&disabledID=" + this.disabled.ID
        );
      }
      this.assistiveDevices = [];
      //答案列表
      for (const key in answers) {
        //问题选项
        let optionIDs = answers[key].OptionIDs.split(",");
        let exama;
        //所有问题
        let questions;
        //问题
        let question;
        //问题选项数组(key)
        const questionKey = [];
        //子选项数组
        const twoOptionIDs = [];
        if (!this.IsView) {
          //做完之后直接查看
          exama = this.questionManager.questionsFlow[key];
          questions = this.exams[exama.ExamID];
          question = questions[exama.QuestionNo];
          //辅具查询(答案选项，答案记录数据，问题集合)
          await this.assistiveList(optionIDs, exama, questions);
          //数组转换
          this.arrayChange(questionKey, question, optionIDs, twoOptionIDs);
          //问题选择的选项
          this.answerOptions(
            exama,
            optionIDs,
            question,
            questions,
            twoOptionIDs
          );

          //遍历选项获取选项文本
          await this.condition(question, optionIDs, assistivesType);
          question.show = true;
        } else {
          //从数据库查询
          exama = answers[key];
          questions = this.exams[exama.ExamID];
          question = questions[exama.QuestionNo];

          //辅具查询(答案选项，答案记录数据，问题集合)
          if (optionIDs != "") {
            await this.assistiveList(optionIDs, exama, questions);
          }
          //数组转换
          this.arrayChange(questionKey, question, optionIDs, twoOptionIDs);
          //问题选择的选项
          this.answerOptions(
            exama,
            optionIDs,
            question,
            questions,
            twoOptionIDs
          );

          //遍历选项获取选项文本
          await this.condition(question, optionIDs, assistivesType);
          question.show = true;
        }
      }

      if (this.assistiveDevices.length > 0) {
        //筛选
        if (this.conditions.length === 0) {
          for (let a in this.assistiveDevices) {
            const aty = this.assistiveDevices[a];
            //辅具所有信息
            this.assistiveChange.push(aty);
            //辅具显示
            const type = aty.Type;

            let content = this.pure(this.showContent);
            if (content[type] != false) {
              content[type] = false;
              this.showContent = content;
            }
            const path = await this.$http.get(
              "AssistiveDevices/ShowImagePath",
              assistMath
            );
            if (typeof path === "string") {
              this.image = path;
            } else {
              this.image = this.img;
            }
            //辅具名称(用来选择)
            //this.assistiveName.push(at.Name);
            this.assistiveName.push({
              key: aty.ID,
              value: aty.Name,
              type: aty.Type,
              img: this.image,
              price: aty.Price
            });
          }
        } else {
          for (const ty in this.assistiveDevices) {
            const assist = this.assistiveDevices[ty];
            if (this.conditions.indexOf(assist.Type) === -1) {
              this.assistiveDevices.splice(ty, 1);
            }
          }
          //显示辅具
          let table = document.getElementById("assistiveType");
          for (const b in this.conditions) {
            const bt = this.conditions[b];
            //table.innerHTML = bt;
            for (let a in this.assistiveDevices) {
              const at = this.assistiveDevices[a];
              if (at.Type === bt) {
                //辅具所有信息
                this.assistiveChange.push(at);
                //辅具显示
                const type = at.Type;

                let content = this.pure(this.showContent);
                if (content[type] != false) {
                  content[type] = false;
                  this.showContent = content;
                }
                //辅具图片
                let assistMath = {
                  id: at.ID,
                  name: at.Name,
                  type: at.Type
                };
                const imgPath = await this.$http.get(
                  "AssistiveDevices/ShowImagePath",
                  assistMath
                );
                if (typeof imgPath === "string") {
                  this.image = imgPath;
                } else {
                  this.image = this.img;
                }
                //辅具名称(用来选择)
                //this.assistiveName.push(at.Name);
                this.assistiveName.push({
                  key: at.ID,
                  value: at.Name,
                  type: at.Type,
                  img: this.image,
                  price: at.Price
                });
              }
            }
          }
        }

        this.showAssistiveDevicesTable = true;
      }
    },
    //查看答案时数组转换
    arrayChange(questionKey, question, optionIDs, twoOptionIDs) {
      //遍历题目选项
      for (const one of question.Options) {
        questionKey.push(one.key);
      }
      //判断当前选项是否为二级选项
      for (let i = 0; i < optionIDs.length; i++) {
        if (questionKey.indexOf(parseInt(optionIDs[i])) === -1) {
          twoOptionIDs.push(parseInt(optionIDs[i]));
          optionIDs.splice(i, 1);
        }
      }
      //字符串数组转int数组
      for (let i = 0; i < optionIDs.length; i++) {
        optionIDs[i] = parseInt(optionIDs[i]);
      }
    },
    //查看答案时问题选择的选项
    answerOptions(exam, optionIDs, question, questions, twoOptionIDs) {
      let currentChecklist = "checklist" + exam.ExamID + exam.QuestionNo;
      this.$refs[currentChecklist][0].currentValue = optionIDs;

      if (question.Type === 4) {
        for (const id of optionIDs) {
          let questionNo = question.QueryOptions[id].NextQuestionNo;
          const nextQuestion = questions[questionNo];
          this.$refs[currentChecklist][0].currentSubValue = twoOptionIDs;
          this.$refs[currentChecklist][0].messages = exam.Other;
        }
      }
      if (question.Type === 7) {
        let url = exam.Other.split(",");
        this.$refs[currentChecklist][0].images = url;
      }
    },
    //查看答案时辅具查询(答案选项，答案记录数据，问题集合)
    async assistiveList(optionIDs, answer, questions) {
      for (const i in optionIDs) {
        const optionId = optionIDs[i];
        let option;
        if (questions[answer.QuestionNo].Type === 4) {
          for (const j in questions) {
            let ops = questions[j].Options;
            for (const k in ops) {
              let key = ops[k].key;
              if (parseInt(optionId) === key) {
                option = questions[questions[j].QuestionNo].QueryOptions[key];
              }
            }
          }
        } else {
          option = questions[answer.QuestionNo].QueryOptions[optionId];
        }
        if (option.AssistiveDevices != "") {
          let assistives = option.AssistiveDevices.split(",");
          for (const assistive of assistives) {
            const assistiveDevice = await this.$api.getAssistiveDevice(
              parseInt(assistive)
            );
            if (this.assistiveDevices.indexOf(assistiveDevice) === -1) {
              this.assistiveDevices.push(assistiveDevice);
            }
          }
        }
      }
    },
    //遍历选项获取选项文本
    async condition(question, optionIDs, assistivesType) {
      if (question.Type === 8) {
        this.conditions = [];
        for (const ok of optionIDs) {
          for (const qk of question.Options) {
            if (qk.key === ok) {
              var value = qk.value.split(".")[1];
              if (
                assistivesType.indexOf(value) > -1 &&
                this.conditions.indexOf(value) === -1
              ) {
                this.conditions.push(value);
              }
            }
          }
        }
        return;
      } else {
        for (const cv of optionIDs) {
          for (const ov of question.Options) {
            if (ov.key === cv) {
              let list = question.QueryOptions[cv].AssistiveDevices;
              if (list != "") {
                if (list.indexOf(",") > -1) {
                  let value = list.split(",");
                  for (let i = 0; i < value.length; i++) {
                    const type1 = await this.$api.getAssistiveDevice(
                      parseInt(value[i])
                    );
                    const t = type1.Type;
                    if (
                      assistivesType.indexOf(t) > -1 &&
                      this.conditions.indexOf(t) === -1
                    ) {
                      this.conditions.push(t);
                    }
                  }
                } else {
                  const type2 = await this.$api.getAssistiveDevice(
                    parseInt(list)
                  );
                  const k = type2.Type;
                  if (
                    assistivesType.indexOf(k) > -1 &&
                    this.conditions.indexOf(k) === -1
                  ) {
                    this.conditions.push(k);
                  }
                }
              }
            }
          }
        }
      }
    },

    async loadCheckAssistive(assistiveAnswer) {
      if (!assistiveAnswer) {
        let sqlAssistiveAnswer = await this.$api.getAssistiveAnswers(
          "?ExamID=" + this.examID + "&disabledID=" + this.disabled.ID
        );
        if (sqlAssistiveAnswer === []) {
          this.currentValue = [];
        } else {
          for (const sql in sqlAssistiveAnswer) {
            // let options = sqlAssistiveAnswer[sql].OptionIDs.split(",");
            // this.currentValue = options;
            this.currentValue.push(sqlAssistiveAnswer[sql].ID);
            this.total = this.total + sqlAssistiveAnswer[sql].Total;
          }
        }
      } else {
        for (const s in assistiveAnswer) {
          if (assistiveAnswer[s].optionIDs != undefined) {
            let options = assistiveAnswer[s].optionIDs.split(",");
            this.currentValue = options;
            this.total = this.total + assistiveAnswer[s].Total;
          }
        }
      }
    },
    pure(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    //审核修改
    examChange() {
      this.IsCheck = false;
      this.showNumber = true;
    },
    //审核未通过
    examBack() {
      let assistive = [];
      assistive.push({
        ExamID: this.examID,
        DisabledID: this.disabled.ID
      });
      this.$http.post("AssistiveAnswers/DeleteAnswers", assistive).then(r => {
        this.$utils.Alert("操作成功", "已发回重新评估");
        this.$router.push("/JiGouPingGuHome");
      });
    },
    //审核通过
    examNext() {
      let Key = localStorage.getItem("loginUserBaseInfo");
      let obj = JSON.parse(Key);
      let uID = obj.I;
      this.assistiveChange;
      this.currentValue;
      let assistive = [];
      assistive.push({
        ExamID: this.examID,
        DisabledID: this.disabled.ID,
        Auditor: uID
      });
      let assistiveAnswer = [];
      if (this.assistiveChange.length === 0) {
        assistiveAnswer.push({
          DisabledID: this.disabledID,
          ExamID: this.examID
        });
      } else {
        for (const id of this.currentValue) {
          for (const all of this.assistiveChange) {
            if (parseInt(id) === all.ID) {
              assistiveAnswer.push({
                ID: all.ID,
                Name: all.Name,
                Type: all.Type,
                DisabledID: this.disabledID,
                ExamID: this.examID,
                optionIDs: this.currentValue.join(","),
                Number: 1,
                Price: all.Price,
                Total: 0
              });
            }
          }
        }
      }
      for (let q = 0; q < assistiveAnswer.length; q++) {
        for (let w = 0; w < this.currentNumber.length; w++) {
          if (assistiveAnswer[q].ID === this.currentNumber[w].id) {
            assistiveAnswer[q].Number = this.currentNumber[w].number;
            assistiveAnswer[q].Total =
              this.currentNumber[w].number * assistiveAnswer[q].Price;
          }
        }
      }
      this.$http
        .post("AssistiveAnswers/SaveAnswers", assistiveAnswer)
        .then(x => {
          this.$http.put("ExamRecords/Modify", assistive).then(r => {
            this.$utils.Alert("操作成功", "已通过审核");
            this.State = "3";
            this.$router.push("/JiGouPingGuHome");
          });
        });
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
            if (list[i] === parseInt(this.currentValue[j])) {
              index += 1;
            }
          }
        }
      } else {
        index = 0;
      }
      return index;
    },
    changeAssistive(type) {
      let list = [];
      for (let i = 0; i < this.assistiveName.length; i++) {
        let t = this.assistiveName[i];
        if (type === t.type) {
          list.push({
            key: t.key,
            value: t.value,
            type: t.type,
            img: t.img,
            price: t.price
          });
        }
      }
      return list;
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
     getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
  },
  computed: {
    //年龄计算
    age() {
      let age = this.$utils.CalcAge(
        this.disabled.HasCertificate,
        this.disabled.Certificate,
        this.disabled.IDNumber
      );
      return age;
    },

    //审核按钮使用
    canAdopt() {
      if (this.State === "2") {
        return false;
      }
      return true;
    },
    showView() {
      if (this.State === "3") {
        return true;
      }
    },
    //试卷是否做过
    IsView() {
      if (this.State != "0") {
        return true;
      }
    },
    assistiveDisabled() {
      if (this.State === "1") {
        return !this.showNumber;
      } else {
        return this.showNumber;
      }
    }
  },
  watch: {
    "disabled.Certificate"() {
      if (this.disabled.Certificate.length < 20) return;
      let a = this.$utils.CalcCategoryDegree(this.disabled.Certificate);
      if (a != null) {
        this.disabled.CategoryID = a.category;
        this.disabled.DegreeID = a.degree;
      } else {
        this.disabled.CategoryID = null;
        this.disabled.DegreeID = null;
      }
    },
    currentValue() {
      let to = 0;
      if (this.currentValue.length > 0) {
        let assistiveAnswer = [];
        for (const id of this.currentValue) {
          for (const all of this.assistiveChange) {
            if (parseInt(id) === all.ID) {
              assistiveAnswer.push({
                ID: all.ID,
                Name: all.Name,
                Type: all.Type,
                DisabledID: this.disabledID,
                ExamID: this.examID,
                optionIDs: this.currentValue.join(","),
                Number: 1,
                price: all.Price
              });
            }
          }
        }
        if (this.currentNumber.length > 0) {
          for (let q = 0; q < assistiveAnswer.length; q++) {
            for (let w = 0; w < this.currentNumber.length; w++) {
              if (assistiveAnswer[q].ID === this.currentNumber[w].id) {
                assistiveAnswer[q].Number = this.currentNumber[w].number;
              }
            }
          }

          for (let i = 0; i < assistiveAnswer.length; i++) {
            let price = assistiveAnswer[i].Number * assistiveAnswer[i].price;
            this.total = to + price;
          }
        }
      }
    },
    assistNumber() {
      let to = 0;
      let assistiveAnswer = [];
      if (this.currentValue.length > 0) {
        for (const id of this.currentValue) {
          for (const all of this.assistiveChange) {
            if (parseInt(id) === all.ID) {
              assistiveAnswer.push({
                ID: all.ID,
                Name: all.Name,
                Type: all.Type,
                DisabledID: this.disabledID,
                ExamID: this.examID,
                optionIDs: this.currentValue.join(","),
                Number: 1,
                price: all.Price
              });
            }
          }
        }
        for (let q = 0; q < assistiveAnswer.length; q++) {
          for (let w = 0; w < this.currentNumber.length; w++) {
            if (assistiveAnswer[q].ID === this.currentNumber[w].id) {
              assistiveAnswer[q].Number = this.currentNumber[w].number;
            }
          }
        }

        for (let i = 0; i < assistiveAnswer.length; i++) {
          let price = assistiveAnswer[i].Number * assistiveAnswer[i].price;
          this.total = to + price;
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
