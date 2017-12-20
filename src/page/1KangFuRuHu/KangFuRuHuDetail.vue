<template>
  <div>
     <x-header
      style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      康复人员信息登记表
    </x-header>
    <form>
      <group title="个人信息" label-width="6em" label-margin-right="1em" >
        <x-input title="姓名" v-model="disabledInfo.Name" required ref="Name"></x-input>
        <selector title="性别" v-model="disabledInfo.Sex" required ref="Sex" :options="Sexlist"></selector>
        <x-input title="监护人" v-model="disabledInfo.Guardian" required ref="Guardian"></x-input>
        <selector title="与残疾人关系" v-model="disabledInfo.RelationshipID" required ref="RelationshipID" :options="RelationshipList"></selector>
        <x-input title="联系电话" v-model="disabledInfo.Tel" required ref="Tel" type="tel" :max="13"></x-input>
        <x-switch title="有无残疾证" v-model="disabledInfo.HasCertificate"></x-switch>
        <x-input title="残疾证号" v-model="disabledInfo.Certificate" required ref="Certificate" type="number" :min="20" :max="21" v-if="disabledInfo.HasCertificate"></x-input>
        <x-input title="身份证号" v-model="disabledInfo.IDNumber" required ref="IDNumber" type="number" :min="18" :max="18" v-if="!disabledInfo.HasCertificate"></x-input>
        <x-input title="年龄" :value="age" disabled></x-input>
        <checklist title="残疾类别" v-model="disabledInfo.Categories" required :disabled="!canChoose" ref="Categories" :options="Categories" label-position="left" :max="this.disabledInfo.CategoryID===7?6:1"></checklist>
        <x-switch title="有无康复需求" v-model="disabledInfo.Need"></x-switch>
      </group>
      <group>
        <group title="视力" v-if="disabledInfo.Categories.indexOf(1) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="视力残疾等级" :readonly="!canChoose" v-model="disabledInfo.DisabledInfo_Details[0].DegreeID" :options="Degrees" direction="right" required ref="VisionDegreeID"></selector>
          <popup-picker title="康复需求" v-if="disabledInfo.Need" v-model="disabledInfo.DisabledInfo_Details[0].RehabilitationIDs" :data="Lists.VisionList" :columns="2" :column-width="[1/3]" required ref="VisionRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector title="服务走向" v-if="disabledInfo.Need" v-model="disabledInfo.DisabledInfo_Details[0].NextID" :options="Nexts" direction="right" required ref="VisionNextID"></selector>
        </group>
        <group title="听力" v-if="disabledInfo.Categories.indexOf(2) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="听力残疾等级" :readonly="!canChoose" v-model="disabledInfo.DisabledInfo_Details[1].DegreeID" :options="Degrees" direction="right" required ref="HearingDegreeID"></selector>
          <popup-picker v-if="disabledInfo.Need" title="康复需求" v-model="disabledInfo.DisabledInfo_Details[1].RehabilitationIDs" :data="Lists.HearingList" :columns="2" :column-width="[1/3]" required ref="HearingRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="disabledInfo.Need" title="服务走向" v-model="disabledInfo.DisabledInfo_Details[1].NextID" :options="Nexts" direction="right" required ref="HearingNextID"></selector>
        </group>
        <group title="言语" v-if="disabledInfo.Categories.indexOf(3) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="言语残疾等级" v-model="disabledInfo.DisabledInfo_Details[2].DegreeID" :options="Degrees" direction="right" required ref="SpeakingDegreeID"></selector>
        </group>
        <group title="肢体" v-if="disabledInfo.Categories.indexOf(4) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="肢体残疾等级" v-model="disabledInfo.DisabledInfo_Details[3].DegreeID" :options="Degrees" direction="right" required ref="BodyDegreeID"></selector>
          <popup-picker v-if="disabledInfo.Need" title="康复需求" v-model="disabledInfo.DisabledInfo_Details[3].RehabilitationIDs" :data="Lists.BodyList" :columns="2" :column-width="[1/3]" required ref="BodyRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="disabledInfo.Need" title="服务走向" v-model="disabledInfo.DisabledInfo_Details[3].NextID" :options="Nexts" direction="right" required ref="BodyNextID"></selector>
        </group>
        <group title="智力" v-if="disabledInfo.Categories.indexOf(5) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="智力残疾等级" v-model="disabledInfo.DisabledInfo_Details[4].DegreeID" :options="Degrees" direction="right" required ref="IntelligenceDegreeID"></selector>
          <popup-picker v-if="disabledInfo.Need" title="康复需求" v-model="disabledInfo.DisabledInfo_Details[4].RehabilitationIDs" :data="Lists.IntelligenceList" :columns="2" :column-width="[1/3]" required ref="IntelligenceRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="disabledInfo.Need" title="服务走向" v-model="disabledInfo.DisabledInfo_Details[4].NextID" :options="Nexts" direction="right" required ref="IntelligenceNextID"></selector>
        </group>
        <group title="精神" v-if="disabledInfo.Categories.indexOf(6) !== -1" label-width="6em" label-margin-right="2em">
          <selector title="精神残疾等级" v-model="disabledInfo.DisabledInfo_Details[5].DegreeID" :options="Degrees" direction="right" required ref="SpiritDegreeID"></selector>
          <popup-picker v-if="disabledInfo.Need" title="康复需求" v-model="disabledInfo.DisabledInfo_Details[5].RehabilitationIDs" :data="Lists.SpiritList" :columns="2" :column-width="[1/3]" required ref="SpiritRehabilitationIDs" show-name value-text-align="left"></popup-picker>
          <selector v-if="disabledInfo.Need" title="服务走向" v-model="disabledInfo.DisabledInfo_Details[5].NextID" :options="Nexts" direction="right" required ref="SpiritNextID"></selector>
        </group>
      </group>
      <x-button type="primary" action-type="button" @click.native="submit">保存</x-button>
    </form>
  </div>
</template>

<script>
import { XHeader,Group, XInput, Checklist, Selector,XSwitch,XButton,PopupPicker  } from 'vux'
export default {
  name: 'KangFuRuHuDetail',
    components: {
      XHeader,
      Group,
      XInput,
    Checklist,
    Selector,
    XSwitch,
    XButton,
    PopupPicker,
     
  },
  data () {
    return {
      Sexlist: [{key: 1, value: '男'}, {key: 2, value: '女'}],
      RelationshipList:[{key: 1, value: '父母'},{key: 2, value: '配偶'},{key: 3, value: '兄弟姐妹'},{key: 4, value: '祖父母'},{key: 5, value: '其他'}],
      Categories:[],
      Degrees:[],
      Nexts:[],
      Lists:{
        VisionList:[],
        HearingList:[],
        BodyList:[],
        IntelligenceList:[],
        SpiritList:[],
      },
      DefaultDetails:[
        {
          ID:null,
          CategoryID:1,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        },{
          ID:null,
          CategoryID:2,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        },{
          ID:null,
          CategoryID:3,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        },{
          ID:null,
          CategoryID:4,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        },{
          ID:null,
          CategoryID:5,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        },{
          ID:null,
          CategoryID:6,
          DegreeID:null,
          RehabilitationIDs:[],
          RehabilitationID:null,
          NextID:null,
          TargetExamName:""
        }
      ],
      disabledInfo:{
        ID:this.$route.params.id,
        Name:"",
        Sex:null,
        Tel:"",
        Guardian:"",
        RelationshipID:null,
        HasCertificate:true,
        Certificate:"",
        IDNumber:"",
        CategoryID:null,
        DegreeID:null,
        Categories:[],
        Need:true,
        DoorService:"",
        FirstSign:"",
        SecondSign:"",
        DisabledInfo_Details:[],
      },
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData(){
      //绑定人员基本信息
      var id = this.$route.params.id
      if(id!=null){
        this.getDisabledInfo(id)
      }else{
        this.disabledInfo.DisabledInfo_Details = this.DefaultDetails
      }
      //填充选项列表
      this.$api.GetCategories().then(r => { this.Categories = r })
      this.$api.GetDegrees().then(r => { this.Degrees = r })
      this.$api.GetRehabilitationData().then(r => { this.Lists = r })
      this.$api.GetNexts().then(r => { this.Nexts = r })
    },
    getDisabledInfo (id) {
      var _this=this
      this.$api.GetDisabledInfo(id).then(r => {
        let details=this.DefaultDetails.slice() 
        r.Categories=[]
        r.DisabledInfo_Details.forEach(function(item,i) {
          if(item) {
            r.Categories.push(item.CategoryID)
            if(item.RehabilitationID){
              item.RehabilitationIDs=[item.RehabilitationID.toString().substr(0,5),item.RehabilitationID.toString()]
            }
            details[item.CategoryID-1]=item
          }
        });
        r.DisabledInfo_Details=details
        _this.disabledInfo=r
      })
    },
    change (val, label) {
      console.log('change', val, label)
    },
    submit() {
      //表单验证
      if(false){
      var msg=""
      if(!this.$refs.Name.valid){
        msg=this.$refs.Name.title+(this.$refs.Name.firstError==null?"必填哦":this.$refs.Name.firstError)
      }else if (!this.$refs.Tel.valid){
        msg=this.$refs.Tel.title+(this.$refs.Tel.firstError==null?"必填哦":this.$refs.Tel.firstError)
      }
      if (msg=="") {
        if(this.disabledInfo.HasCertificate) {
          if(!this.$refs.Certificate.valid){
            msg=this.$refs.Certificate.title+(this.$refs.Certificate.firstError==null?"必填哦":this.$refs.Certificate.firstError)
          }
        }else{
          if(!this.$refs.IDNumber.valid){
            msg=this.$refs.IDNumber.title+(this.$refs.IDNumber.firstError==null?"必填哦":this.$refs.IDNumber.firstError)
          }
        }
      }
      if (msg=="") {
        if(!this.$refs.Categories.valid){
          msg=this.$refs.Categories.title+(this.$refs.Categories.firstError==null?"必填哦":this.$refs.Categories.firstError)
        }else{
          this.disabledInfo.Categories.forEach(function(item,i) {
            let detail = this.disabledInfo.DisabledInfo_Details[item-1]
            if(!detail.DegreeID){
              msg=this.$refs.HearingDegreeID.title+(this.$refs.HearingDegreeID.firstError==null?"必填哦":this.$refs.HearingDegreeID.firstError)
            }else if(!detail.RehabilitationID){
              msg=this.$refs.HearingRehabilitationIDs.title+(this.$refs.HearingRehabilitationIDs.firstError==null?"必填哦":this.$refs.HearingRehabilitationIDs.firstError)
            }else if(!detail.NextID){
              msg=this.$refs.HearingNextID.title+(this.$refs.HearingNextID.firstError==null?"必填哦":this.$refs.HearingNextID.firstError)
            }
          });
        }
      }
      if(msg!=""){
        this.$utils.Alert('保存失败',msg)
        return
      }
      }
      var _this=this
      //如果未选择，清空后传入后台更新
      for (let i = 0; i < 6; i++) {
        if(this.disabledInfo.Categories.indexOf(i+1)===-1){
          this.disabledInfo.DisabledInfo_Details[i]=null
        }
      }
      var ID = this.$route.params.ID
      if(!ID){
        this.$http.post('DisabledInfoes', this.disabledInfo).then(r => {
            let result = r;
            console.log(r);
            _this.$utils.Alert('保存成功')
            _this.$router.push('/KangFuRuHuHome')
        })
      }else{
        this.$http.put('DisabledInfoes/'+ID, this.disabledInfo).then(r => {
            var result = r;
            console.log(r);
            _this.$utils.Alert('保存成功')
            _this.$router.push('/KangFuRuHuHome')
        })
      }
    }
  },
  computed:{
    //年龄计算
    age(){
      let age = this.$utils.CalcAge(this.disabledInfo.HasCertificate,this.disabledInfo.Certificate,this.disabledInfo.IDNumber)
      return age
    },
    canChoose(){
      return !this.disabledInfo.HasCertificate||this.disabledInfo.CategoryID===7
    }
  },
  watch:{
    //根据残疾证号选择残疾类别和等级
    'disabledInfo.Certificate'() {
      if(this.disabledInfo.Certificate.length<20)return
      let a = this.$utils.CalcCategoryDegree(this.disabledInfo.Certificate)
      if(a!=null){
        this.disabledInfo.CategoryID=a.category
        this.disabledInfo.DegreeID=a.degree
        if(a.category!==7){
          this.disabledInfo.Categories.push(a.category)
          this.disabledInfo.DisabledInfo_Details[a.category-1].DegreeID=a.degree
        }
      }else{
        this.disabledInfo.Categories=[]
        this.disabledInfo.CategoryID=null
        this.disabledInfo.DegreeID=null
      }
    },
    //提取多列选择器的选项
    'disabledInfo.DisabledInfo_Details': {
      handler: function (val, oldVal) {
        this.disabledInfo.DisabledInfo_Details.forEach(element => {
          if(element.RehabilitationIDs.length>0){
            element.RehabilitationID = element.RehabilitationIDs[1]
          }
        });
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  padding-left: 15px;
  line-height: 28px;
  color: #888;
  font-size: 12px;
}
select{
  text-align:right;
}
</style>
