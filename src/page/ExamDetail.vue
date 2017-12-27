<template>
  <div>
    <group title="评估适配系统" label-width="6em" label-margin-right="1em" v-if="showQuestion===false">
      <x-input title="姓名" v-model="disabled.Name" required :disabled="IsView"></x-input>
      <selector title="性别" v-model="disabled.Sex" required :options="Sexlist" :readonly="IsView"></selector>
      <x-switch title="有无残疾证" v-model="disabled.HasCertificate" :disabled="IsView"></x-switch>
      <x-input title="残疾证号" v-model="disabled.Certificate" required :min="20" :max="21" v-if="disabled.HasCertificate" :disabled="IsView"></x-input>
      <x-input title="身份证号" v-model="disabled.IDNumber" required :min="18" :max="18" v-if="!disabled.HasCertificate" :disabled="IsView"></x-input>
      <x-input title="年龄" :value="age" disabled></x-input>
      <datetime title="致残时间" v-model="disabled.data" value-text-align="left" :disabled="IsView" :readonly="IsView"></datetime>
      <selector title="致残原因" v-model="disabled.DisabilityReason" required :options="DisabilityReasons" :readonly="IsView"></selector>
      <selector title="残疾类别" v-model="disabled.CategoryID" required :options="Categories" :readonly="IsView"></selector>
      <selector title="残疾等级" v-model="disabled.DegreeID" required :options="Degrees" direction="right" :readonly="IsView"></selector>
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
      <div >
        <div v-for="(question,key) in Exam.Questions" :key="question.QuestionNo" v-show="question.show" >
          <b><p style="font-size:20px;padding:0.8em;"><span style="color:#428bca;">{{question.Multiple?"多选题":"单选题"}}</span><br>{{key}}.{{question.QuestionText}}</p></b>
          <app-checklist v-model="Exam.Questions[key].Answers" required :options="question.Options" :ref="'checklist'+key" label-position="left" :max="question.Multiple?10:1" @on-change="optionChange" :disabled="IsView"></app-checklist>
          <!-- <checklist v-model="Exam.Questions[key].Answers" required :options="question.Options" :ref="'checklist'+key" label-position="left" :max="question.Multiple?10:1" @on-change="optionChange" :disabled="IsView"></checklist> -->
        </div>
      </div>
      <div v-if="!IsView">
        <flexbox style="bottom: 1em;position: absolute;" :gutter="10">
          <flexbox-item>
            <x-button type="primary" ref="but" @click.native="Previous" :disabled="this.CurrentQuestionIndex===0">上一题</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="Reset">重新答题</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="Next" :disabled="!canNext" v-if="!canSubmitAnswers">下一题</x-button>
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
import AppChecklist from '@/components/AppChecklist'
import { XHeader,Group, XInput, Checklist, Selector,XSwitch,XButton,PopupPicker,Datetime,XAddress,ChinaAddressV4Data,CheckIcon,XDialog,TransferDomDirective as TransferDom,Divider,Flexbox, FlexboxItem,XTable     } from 'vux'
export default {
  name: 'FuJuPingGuDetail',
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
  props:{
    disabledID:String,
    examID:String,
    state:String,
  },
  data () {
    return {
      showQuestion:true,
      State:this.state,
      Exam:{
        ID:null,
        Name:"",
        Questions:null,
        QuestionsFlow:[]
      },
      Sexlist: [{key: 1, value: '男'}, {key: 2, value: '女'}],
      RelationshipList:[{key: 1, value: '父母'},{key: 2, value: '配偶'},{key: 3, value: '兄弟姐妹'},{key: 4, value: '祖父母'},{key: 5, value: '其他'}],
      Categories:[],
      Degrees:[{key:1,value:'一级'},{key:2,value:'二级'},{key:3,value:'三级'},{key:4,value:'四级'},{key:5,value:'未定级'}],
      DisabilityReasons:[],
      addressData: ChinaAddressV4Data,
      Addresses:[],
      Agree:false,
      showScrollBox:false,
      showAssistiveDevicesTable:false,
      Questions:{},
      QuestionsFlow:[],
      CurrentQuestionIndex:null,
      NextQuestionNo:null,
      assistiveDevices:[],
      disabled:{
        ID:null,
        Name:"",
        Sex:null,
        Tel:"",
        Address:[],
        HasCertificate:true,
        Certificate:"",
        IDNumber:"",
        CategoryID:null,
        DegreeID:null,
        Nation:"",
        Height:null,
        Weight:null,
        Email:"",
        Address:null,
        disabled_Details:[],
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData(){
      this.disabled.ID = this.disabledID
      //填充选项列表
      this.Categories = await this.$api.getCategories()
      this.DisabilityReasons = await this.$api.getDisabilityReasons(2)
      this.Degrees = await this.$api.getDegrees()

      if(this.disabled.ID!=null){
        this.getDisabled(this.disabled.ID)
      }
      await this.initQuestions()
      if(this.IsView){
        this.loadAssistiveDevices()
      }
    },
    async getDisabled (ID) {
      this.disabled = await this.$api.getDisabled(ID)
      this.disabled.disabled_Details=null
      if(this.disabled.Address){
        this.Addresses = [this.disabled.Address.slice(0,2)+"0000",this.disabled.Address.slice(0,4)+"00",this.disabled.Address]
      }
    },
    async initQuestions(){
      if(!this.Exam.Name){
        this.Exam = await this.$api.getExam(this.examID)
      }
      if(this.Exam.QuestionsFlow.length>0){
        for (const key in this.Exam.Questions) {
          this.Exam.Questions[key].show=false;
          this.Exam.Questions[key].Answers=[];
        }
      }
      this.Exam.QuestionsFlow=['1']
      this.Exam.Questions['1'].show=true
      this.assistiveDevices=[]
      this.CurrentQuestionIndex=0
    },
    optionChange(optionID,lable){
      if (optionID.length===1&&this.State==='0') {
        var option =this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].QueryOptions[optionID]
        if(option.NextQuestionNo!=null){
          var NextQuestionNo = option.NextQuestionNo
          if(!this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].Multiple){
            //跳到下一题
            this.ToNext(NextQuestionNo)
          }
        }
      }
    },
    Previous(){
      this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].show=false
      this.Exam.QuestionsFlow.pop()
      this.CurrentQuestionIndex--
      let PreviousQuestion = this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]]
      PreviousQuestion.show=true

    },
    Next(){
      this.ToNext()
    },
    ToNext(NextQuestionNo){
      if(!NextQuestionNo){
        let currentChecklist = this.$refs["checklist"+this.Exam.QuestionsFlow[this.CurrentQuestionIndex]][0]
        for (let i = 0; i < currentChecklist.value.length; i++) {
          let optionID = currentChecklist.value[i];
          let option =this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].QueryOptions[optionID]
          if(option.NextQuestionNo){
            NextQuestionNo = option.NextQuestionNo
          }
        }
      }
      if(NextQuestionNo){
        this.Exam.QuestionsFlow.push(NextQuestionNo)
        this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex++]].show=false
        this.Exam.Questions[NextQuestionNo].show=true
      }
    },
    Reset(){
      this.initQuestions()
    },
    setCurrentQuestionID(val,lable){
      this.currentQuestionID=val
    },
    submit() {
      var _this=this
      this.disabled.Address=this.Addresses[2]
      if(!this.disabled.ID){
        this.$http.post('disableds', this.disabled).then(r => {
          let result = r;
          if(!_this.targetExamName){
            if(!_this.disabled.CategoryID){
              $utils.Alert('评估出错','残疾类型有误')
              return
            }
            _this.targetExamName=_this.Categories[_this.disabled.CategoryID-1].value
          }
          _this.initQuestions()
          _this.showScrollBox=true
        })
      }else{
        this.$http.put('disableds/'+this.disabled.ID, this.disabled).then(r => {
            let result = r;
            _this.initQuestions()
            _this.showScrollBox=true
        })
      }
    },
    async loadAssistiveDevices(answers){
      this.assistiveDevices=[]
      if(!answers){
        answers = await this.$api.getAnswers("?ExamID="+this.Exam.ID+"&disabledID="+this.disabled.ID)
      }
      for (const key in answers) {
        let optionIDs = answers[key].OptionIDs.split(',')
        this.Exam.Questions[answers[key].QuestionNo].Answers=optionIDs
        this.Exam.Questions[answers[key].QuestionNo].show=true

        for (const k in optionIDs) {
            const optionID = optionIDs[k];
            const option = this.Exam.Questions[answers[key].QuestionNo].QueryOptions[optionID]
            if(option.AssistiveDeviceName){
            this.assistiveDevices.push(option.AssistiveDeviceName);
          }
        }
      }
      let html=[]
      for (const key in this.assistiveDevices) {
        const value = this.assistiveDevices[key];
        html.push(['<tr><td>',key,'</td><td>',value,'</td></tr>'].join(''))
      }
      this.showAssistiveDevicesTable=true
      let table = document.getElementById("assistiveDevicesTable")
      table.innerHTML=html.join('')
    },
    SubmitAnswers(){
      let Answers=[]
      for (let i = 0; i < this.Exam.QuestionsFlow.length; i++) {
        let question = this.Exam.Questions[this.Exam.QuestionsFlow[i]]
        Answers.push({
          ExamID:this.Exam.ID,
          QuestionID:question.ID,
          QuestionNo:question.QuestionNo,
          OptionIDs:question.Answers.join(','),
          disabledID:this.disabled.ID
        })
      }
      this.$http.post('Answers/SaveAnswers', Answers).then(r => {
        this.$utils.Alert('适配成功')
        this.State="1"
        this.loadAssistiveDevices(Answers)
        //this.$router.push('/FuJuPingGuHome')
      })
    }
  },
  computed:{
    //年龄计算
    age(){
      let age = this.$utils.CalcAge(this.disabled.HasCertificate,this.disabled.Certificate,this.disabled.IDNumber)
      return age
    },
    canNext(){
      if(this.Exam.QuestionsFlow.length>0){
        let question = this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]]
        if(question.Answers.length>0){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    canSubmitAnswers(){
      if(this.Exam.QuestionsFlow.length>0){
        if(this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].Answers.length>0){
          let currentChecklist = this.$refs["checklist"+this.Exam.QuestionsFlow[this.CurrentQuestionIndex]][0]
          for (let i = 0; i < currentChecklist.value.length; i++) {
            let optionID = currentChecklist.value[i];
            let option =this.Exam.Questions[this.Exam.QuestionsFlow[this.CurrentQuestionIndex]].QueryOptions[optionID]
            if(option.NextQuestionNo){
              return false;
            }
          }
          return true
        }
      }
    },
    IsView(){
      if(this.State==="1"){
        return true
      }
    }
  },
  watch:{
    'disabled.Certificate'() {
      if(this.disabled.Certificate.length<20)return
      let a = this.$utils.CalcCategoryDegree(this.disabled.Certificate)
      if(a!=null){
        this.disabled.CategoryID=a.category
        this.disabled.DegreeID=a.degree
      }else{
        this.disabled.CategoryID=null
        this.disabled.DegreeID=null
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
