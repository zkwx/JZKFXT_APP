<template>
  <div>
    <div v-if="showQuestion||IsView">
      <div v-for="(questions,examID) in exams" :key="examID">
        <div v-for="(question,QuestionNo) in questions" :key="QuestionNo">
          <app-checklist v-show="question.show" required :examID="examID" :ref="'checklist'+examID+QuestionNo" :question="question" :questions="questions" :options="question.Options" label-position="left" :max="(question.Type===1 ||question.Type===3 )?1:question.Type===8?3:10" @on-change="optionChange" :disabled="IsView"></app-checklist>
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
        localStorage.removeItem(this.disabled.ID);
      }
      await this.initQuestions();

      if (this.IsView) {
        this.loadAssistiveDevices();
        this.loadCheckAssistive();
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
      //时间差
      let recode = await this.$api.getExamRecord(
        "?ExamID=" + this.examID + "&disabledID=" + this.disabled.ID
      );
      let recode1;
      let examId;
      let err;
      let vstate;
      if (
        recode.Evaluated === true &&
        recode.FinishTime != null &&
        recode.NextID === 2
      ) {
        if (this.State === "4" && this.examID < 9) {
          examId = 11;
          let param = { ExamID: examId, DisabledID: this.disabled.ID };
          recode1 = await this.$http
            .get("ExamRecords/Select", param)
            .then(r => {
              vstate = r.State;
            });
        }
      } else {
        if (recode.FinishTime != null) {
          if (this.State === "4" && this.examID < 9) {
            var bng = new Date(recode.FinishTime);
            var end = new Date();

            if (bng.getFullYear() > end.getFullYear()) {
              this.$utils.Alert("操作失败", "时间格式出错");
            } else {
              if (bng.getMonth() + 1 > end.getMonth() + 1) {
                this.$utils.Alert("操作失败", "时间格式出错");
              } else if (bng.getMonth() + 1 === end.getMonth() + 1) {
                this.$utils.Alert("操作失败", "未到回访时间");
              } else {
                if (end.getMonth() + 1 - (bng.getMonth() + 1) === 1) {
                  if (end.getDate() < bng.getDate()) {
                    this.$utils.Alert("操作失败", "未到回访时间");
                  } else {
                    examId = 9;
                    let param = {
                      ExamID: examId,
                      DisabledID: this.disabled.ID
                    };
                    recode1 = await this.$http
                      .get("ExamRecords/Select", param)
                      .then(r => {
                        vstate = r.State;
                      });
                  }
                } else if (
                  end.getMonth() + 1 - (bng.getMonth() + 1) > 1 &&
                  end.getMonth() + 1 - (bng.getMonth() + 1) < 6
                ) {
                  examId = 9;
                  let param = {
                    ExamID: examId,
                    DisabledID: this.disabled.ID
                  };
                  recode1 = await this.$http
                    .get("ExamRecords/Select", param)
                    .then(r => {
                      vstate = r.State;
                    });
                } else if (end.getMonth() + 1 - (bng.getMonth() + 1) >= 6) {
                  if (end.getDate() < bng.getDate()) {
                    examId = 9;
                    let param = {
                      ExamID: examId,
                      DisabledID: this.disabled.ID
                    };
                    recode1 = await this.$http
                      .get("ExamRecords/Select", param)
                      .then(r => {
                        vstate = r.State;
                      });
                  } else {
                    examId = 10;
                    let param = {
                      ExamID: examId,
                      DisabledID: this.disabled.ID
                    };
                    recode1 = await this.$http
                      .get("ExamRecords/Select", param)
                      .then(r => {
                        vstate = r.State;
                      });
                  }
                }
              }
            }
          }
        }
      }

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

      if (this.State === "4" && examId) {
        this.questionManager.questionsFlow.push({
          examID: examId.toString(),
          questionNo: "1",
          messages: ""
        });

        let ex = JSON.parse(localStorage.getItem("loginUserBaseInfo"));
        if (!ex) {
          debugger;
          localStorage.setItem(this.disabled.ID, JSON.stringify(this.examID));
        }

        this.$router.push({
          path: "/AssistVisit/" + this.disabled.ID + "/" + examId + "/" + vstate
        });
        location.reload();
      } else {
        this.questionManager.questionsFlow.push({
          examID: this.examID,
          questionNo: "1",
          messages: ""
        });
      }

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
      if (!this.$refs[currentChecklist]) return null;
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
          if (type === 4 || type === 3) {
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

      if (question.Type === 3) {
        for (const key in checklist.currentValue) {
          const k = checklist.currentValue[key];
          for (const optionID of question.Options) {
            if (optionID.key === k) {
              if (optionID.value.indexOf("其他") > -1) {
                checklist.messages = "";
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
        if (question.Type === 4 || question.Type === 3) {
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
      // //所有辅具
      // const assistives = await this.$api.getAllAssistives();
      // //所有辅具类型
      // const assistivesType = [];
      // for (const t of assistives) {
      //   if (assistivesType.indexOf(t.Type) === -1) {
      //     assistivesType.push(t.Type);
      //   }
      // }
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
          questions = this.exams[exama.examID];
          question = questions[exama.questionNo];
          //辅具查询(答案选项，答案记录数据，问题集合)
          //await this.assistiveList(optionIDs, exama, questions);
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
          //await this.condition(question, optionIDs, assistivesType);
          question.show = true;
        } else {
          //从数据库查询
          exama = answers[key];
          questions = this.exams[exama.ExamID];
          question = questions[exama.QuestionNo];

          //辅具查询(答案选项，答案记录数据，问题集合)
          // if (optionIDs != "") {
          //   await this.assistiveList(optionIDs, exama, questions);
          // }
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
          //await this.condition(question, optionIDs, assistivesType);
          question.show = true;
        }
      }

      // if (this.assistiveDevices.length > 0) {
      //   //筛选
      //   if (this.conditions.length === 0) {
      //     for (const a in this.assistiveDevices) {
      //       const at = this.assistiveDevices[a];
      //       //辅具所有信息
      //       this.assistiveChange.push(at);
      //       //辅具名称(用来选择)
      //       this.assistiveName.push(at.Name);
      //     }
      //   } else {
      //     for (const ty in this.assistiveDevices) {
      //       const assist = this.assistiveDevices[ty];
      //       if (this.conditions.indexOf(assist.Type) === -1) {
      //         this.assistiveDevices.splice(ty, 1);
      //       }
      //     }
      //     //显示辅具
      //     let table = document.getElementById("assistiveType");
      //     for (const b in this.conditions) {
      //       const bt = this.conditions[b];
      //       //table.innerHTML = bt;
      //       for (const a in this.assistiveDevices) {
      //         const at = this.assistiveDevices[a];
      //         if (at.Type === bt) {
      //           //辅具所有信息
      //           this.assistiveChange.push(at);
      //           //辅具名称(用来选择)
      //           this.assistiveName.push(at.Name);
      //         }
      //       }
      //     }
      //   }

      //   this.showAssistiveDevicesTable = true;
      // }
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
      let ex;
      let qu;
      if (exam.examID) {
        ex = exam.examID;
        qu = exam.questionNo;
      } else {
        ex = exam.ExamID;
        qu = exam.QuestionNo;
      }
      let currentChecklist = "checklist" + ex + qu;
      this.$refs[currentChecklist][0].currentValue = optionIDs;

      if (question.Type === 4 || question.Type === 3) {
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
    // async assistiveList(optionIDs, answer, questions) {
    //   for (const i in optionIDs) {
    //     const optionId = optionIDs[i];
    //     let option;
    //     if (questions[answer.QuestionNo].Type === 4) {
    //       for (const j in questions) {
    //         let ops = questions[j].Options;
    //         for (const k in ops) {
    //           let key = ops[k].key;
    //           if (parseInt(optionId) === key) {
    //             option = questions[questions[j].QuestionNo].QueryOptions[key];
    //           }
    //         }
    //       }
    //     } else {
    //       option = questions[answer.QuestionNo].QueryOptions[optionId];
    //     }
    //     if (option.AssistiveDevices != "") {
    //       let assistives = option.AssistiveDevices.split(",");
    //       for (const assistive of assistives) {
    //         const assistiveDevice = await this.$api.getAssistiveDevice(
    //           parseInt(assistive)
    //         );
    //         if (this.assistiveDevices.indexOf(assistiveDevice) === -1) {
    //           this.assistiveDevices.push(assistiveDevice);
    //         }
    //       }
    //     }
    //   }
    // },
    //遍历选项获取选项文本
    // condition(question, optionIDs, assistivesType) {
    //   for (const ov of question.Options) {
    //     for (const cv of optionIDs) {
    //       if (ov.key === cv) {
    //         let lv = ov.value;
    //         let value = lv.split(".");
    //         if (assistivesType.indexOf(value[1]) > -1) {
    //           this.conditions.push(value[1]);
    //         }
    //       }
    //     }
    //   }
    // },

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
        let ex = JSON.parse(localStorage.getItem("loginUserBaseInfo"));
        let exam = {
          ExamID: ex,
          DisabledID: this.disabled.ID
        };
        this.$http.post("ExamRecords/ChangeState", exam).then(x => {
          this.$utils.Alert("提交成功");
          this.State = "4";
          localStorage.removeItem(this.disabled.ID);
        });
        this.loadAssistiveDevices(Answers);
        //this.$router.push("/FuJuPingGuHome");
      });
      this.questionManager.questionLast = [];
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
            let options = sqlAssistiveAnswer[sql].OptionIDs.split(",");
            this.currentValue = options;
          }
        }
      } else {
        for (const s in assistiveAnswer) {
          let options = assistiveAnswer[s].optionIDs.split(",");
          this.currentValue = options;
        }
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
        if (nc && nc.currentValue.length > 0) {
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
        if (checklisto && checklisto.currentValue.length > 0) {
          for (const optionID of checklisto.currentValue) {
            const option = questiono.QueryOptions[optionID];
            const NextQuestionNo = option.NextQuestionNo;
            if (option.NextExamID != 0) {
              //试卷跳转
              return false;
            } else if (questiono.Type != 4 && NextQuestionNo) {
              if (questiono.Type === 3 && NextQuestionNo) {
                const nqu = this.exams[this.examID][NextQuestionNo];
                if (
                  nqu.Type === 5 &&
                  nqu.QuestionNo.indexOf(questiono.QuestionNo) > -1
                ) {
                  return true;
                }
              }
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
        if (checklisto && checklisto.currentValue.length === 0) {
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
        }
      }
    },
    //辅具提交按钮使用
    canSubmit() {
      if (
        this.State === "1" &&
        (this.currentValue.length > 0 || this.assistiveChange.length == 0)
      ) {
        return true;
      }
      return false;
    },
    status() {
      if (this.State === "1") {
        return "提交审批";
      } else if (this.State === "2") {
        return "待审核";
      } else if (this.State === "3") {
        return "已通过审核";
      }
    },
    //试卷是否做过
    IsView() {
      if (this.State != "0") {
        return true;
      }
      return false;
    },
    //辅具是否可选
    IsCheck() {
      if (this.State != "1") {
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
