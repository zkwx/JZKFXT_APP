<template>
  <div>
    <group title="评估适配系统" label-width="6em" label-margin-right="1em" v-if="showQuestion===false">
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
      <x-address title="地址" v-model="Addresses" :list="addressData" placeholder="请选择地址" value-text-align="left" :readonly="IsView"></x-address>
      <x-button v-if="!IsView" type="primary" @click.native="submit">评估</x-button>
      <div v-transfer-dom>
        <x-dialog v-model="showScrollBox" hide-on-blur >
          <p style="padding-top:20px;">说明</p>
          <div 
            class="img-box" 
            style="padding:20px;">
            <p style="text-align:justify;">此系统为初筛评估适配，建议随后与医生、验配师、辅助技术工程师等专业技术人员联系（进行测听，确定具体助听器种类）包括听力检查、试用、适应性训练、必要的环境支持后方可获得合适的助听类辅助器具。</p>
          </div>
          <div style="padding: 0 20px 20px 20px;">
            <check-icon 
              style="margin-right:2em;margin-bottom:1em;"
              :value.sync="Agree">阅读并同意</check-icon>
            <x-button 
              :disabled="Agree===false" 
              @click.native="showQuestion=true;showScrollBox=false" 
              type="primary">开始答题</x-button>
          </div>
        </x-dialog>
      </div>
    </group>
    <div v-if="showQuestion||IsView">
      <div v-for="(questions,examID) in exams" :key="examID">
        <div v-for="(question,QuestionNo) in questions" :key="QuestionNo">
          <app-checklist v-show="question.show" required :examID="examID" :ref="'checklist'+examID+QuestionNo" :question="question" :questions="questions" :options="question.Options" label-position="left" :max="question.Type===1?1:10" @on-change="optionChange" :disabled="IsView"></app-checklist>
        </div>
      </div>
      <div v-if="!IsView">
        <flexbox style="bottom: 1em;position: absolute;" :gutter="10">
          <flexbox-item>
            <x-button type="primary" ref="but" @click.native="Previous" :disabled="this.questionManager.currentQuestionsFlowIndex===0">上一题</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="Reset">重新答题</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="ToNext" :disabled="!canNext" v-if="!canSubmitAnswers">下一题</x-button>
            <x-button type="primary" @click.native="SubmitAnswers" :disabled="!canNext" v-if="canSubmitAnswers">提交</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div v-show="showAssistiveDevicesTable || IsView">
      <div class="weui-cells__title">辅具列表</div>
      <x-table :cell-bordered="false" style="background-color:#fff;" >
        <thead>
            <tr>
              <th style="width:20%;">编号</th>
              <th>辅具</th>
            </tr>
          </thead>
          <tbody id='assistiveDevicesTable'>
          </tbody>
      </x-table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AppChecklist from "@/components/AppChecklist";
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
  XTable
} from "vux";
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
    AppChecklist
  },
  props: {
    disabledID: String,
    examID: String,
    state: String
  },
  data() {
    return {
      showQuestion: true,
      State: this.state,
      exams: {}, //{examID,questions}
      questionManager: {
        questionsFlow: [], //{examID,questionNo,options}
        questionLast: [], //{examID,questionNo,options}  存放跳转试卷后原试卷剩下的题
        currentQuestionsFlowIndex: 0
      },
      //answers: [], //{examID,questionNo,options}
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
      }
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
        this.loadAssistiveDevices();
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
        let exam;
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
          exam = this.questionManager.questionsFlow[key];
          questions = this.exams[exam.examID];
          question = questions[exam.questionNo];
          //辅具查询(答案选项，答案记录数据，问题集合)
          await this.assistiveList(optionIDs, exam, questions);
          //数组转换
          this.arrayChange(questionKey, question, optionIDs, twoOptionIDs);
          //问题选择的选项
          this.answerOptions(
            exam,
            optionIDs,
            question,
            questions,
            twoOptionIDs
          );
          question.show = true;
        } else {
          //从数据库查询
          exam = answers[key];
          questions = this.exams[exam.ExamID];
          question = questions[exam.QuestionNo];

          //辅具查询(答案选项，答案记录数据，问题集合)
          if (optionIDs != "") {
            await this.assistiveList(optionIDs, exam, questions);
          }
          //数组转换
          this.arrayChange(questionKey, question, optionIDs, twoOptionIDs);
          //问题选择的选项
          this.answerOptions(
            exam,
            optionIDs,
            question,
            questions,
            twoOptionIDs
          );
          question.show = true;
        }
      }

      if (this.assistiveDevices.length > 0) {
        let html = [];
        for (const id in this.assistiveDevices) {
          const value = this.assistiveDevices[id].Name;
          html.push(
            ["<tr><td>", id, "</td><td>", value, "</td></tr>"].join("")
          );
        }
        this.showAssistiveDevicesTable = true;
        let table = document.getElementById("assistiveDevicesTable");
        table.innerHTML = html.join("");
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
        const option = questions[answer.QuestionNo].QueryOptions[optionId];
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
    //筛选辅具
    screenAssistives(optionIDs,answer,questions,assistiveDevices){
      
    },
    //试卷提交
    SubmitAnswers() {
      //最后一题选择下拉添加
      const question = this.getCurrentQuestion();
      const checklist = this.getCurrentChecklist();

      const lastQuestion = this.questionManager.questionsFlow[
        this.questionManager.currentQuestionsFlowIndex
      ];

      if (question.Type === 5) {
        lastQuestion.options = [];
        lastQuestion.messages = checklist.messages;
      } else if (question.Type === 7) {
        lastQuestion.options = [];
        lastQuestion.messages = checklist.images.join(",");
      } else {
        lastQuestion.options = checklist.currentValue.concat(
          checklist.currentSubValue
        );
        lastQuestion.messages = checklist.messages;
      }

      let Answers = [];
      for (let i = 0; i < this.questionManager.questionsFlow.length; i++) {
        let que = this.questionManager.questionsFlow[i];
        Answers.push({
          ExamID: que.examID,
          QuestionNo: que.questionNo,
          OptionIDs: que.options.join(","),
          disabledID: this.disabled.ID,
          Other: que.messages
        });
      }
      this.$http.post("Answers/SaveAnswers", Answers).then(r => {
        this.$utils.Alert("适配成功");
        this.State = "1";
        this.loadAssistiveDevices(Answers);
        //this.$router.push('/FuJuPingGuHome')
      });
      this.questionManager.questionLast = [];
    },
    pure(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
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
    //下一题按钮的使用
    canNext() {
      if (this.questionManager.questionsFlow.length > 0) {
        const nq = this.getCurrentQuestion();
        const nc = this.getCurrentChecklist();
        if (nc.currentValue.length > 0) {
          return true;
        }
        if (nq.Type === 5) {
          if (nc.messages != "") {
            return true;
          }
        }
        if (nq.Type === 7) {
          if (nc.fileExist === true) {
            return true;
          }
        }
        return false;
      } else {
        if (this.questionManager.questionsFlow[0] === undefined) {
          return true;
        } else {
          if (this.questionManager.questionsFlow[0].options != undefined) {
            return true;
          }
          return false;
        }
      }
    },
    //下一题或提交
    canSubmitAnswers() {
      if (this.questionManager.questionsFlow.length > 0) {
        let questiono = this.getCurrentQuestion();
        let checklisto = this.getCurrentChecklist();
        if (checklisto.currentValue.length > 0) {
          for (const optionID of checklisto.currentValue) {
            const option = questiono.QueryOptions[optionID];
            const NextQuestionNo = option.NextQuestionNo;
            if (option.NextExamID != 0) {
              //试卷跳转
              return false;
            } else if (questiono.Type != 4 && NextQuestionNo) {
              //问题类型不为 4 且有下一题
              return false;
            } else if (
              questiono.QuestionNo !=
              this.questionManager.questionsFlow[
                this.questionManager.questionsFlow.length - 1
              ].questionNo
            ) {
              //当前题目不是最后一题（多选题）
              return false;
            } else if (
              this.questionManager.questionLast.length > 0 &&
              checklisto.examID != this.examID
            ) {
              //试卷跳回下一题
              return false;
            } else {
              return true;
            }
          }
        }
        if (checklisto.currentValue.length === 0) {
          if (questiono.Type === 5) {
            if (
              questiono.QuestionNo !=
              this.questionManager.questionsFlow[
                this.questionManager.questionsFlow.length - 1
              ].questionNo
            ) {
              //当前题目不是最后一题（多选题）
              return false;
            } else if (
              this.questionManager.questionLast.length > 0 &&
              checklisto.examID != this.examID
            ) {
              //试卷跳回下一题
              return false;
            }
          } else if (questiono.Type === 7) {
            if (
              questiono.QuestionNo !=
              this.questionManager.questionsFlow[
                this.questionManager.questionsFlow.length - 1
              ].questionNo
            ) {
              //当前题目不是最后一题（多选题）
              return false;
            } else if (
              this.questionManager.questionLast.length > 0 &&
              checklisto.examID != this.examID
            ) {
              //试卷跳回下一题
              return false;
            }
          }
          return true;
        }
      }
    },
    IsView() {
      if (this.State === "1") {
        return true;
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
