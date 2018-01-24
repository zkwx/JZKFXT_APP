<template>
  <div>
    <b><p style="font-size:20px;padding:0.8em;"><span style="color:#428bca;" v-text="getQuestionDesc()"></span><br>{{question.QuestionNo}}.{{question.QuestionText}}</p></b>
    <div :class="disabled ? 'vux-checklist-disabled' : ''">
      <!--单选和多选-->
      <div v-if="question.Type<=2||question.Type===6||question.Type===8" class="weui-cells weui-cells_checkbox">
        <label class="weui-cell weui-check_label" :class="{'vux-checklist-label-left': labelPosition === 'left'}" :for="`checkbox_${uuid}_${index}`" v-for="(one, index) in currentOptions" :key="index" v-show="getShow(one)">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check" :name="`vux-checkbox-${uuid}`" :value="getKey(one)" v-model="currentValue" :id="disabled ? '' : `checkbox_${uuid}_${index}`" :disabled="isDisabled(getKey(one))">
            <i class="weui-icon-checked vux-checklist-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">
            <p v-html="getValue(one)"></p>
          </div>
        </label>
      </div>
      <!--单选和多选end-->
      <!--选择后的下拉-->
      <div v-if="question.Type>2 && question.Type<5" class="weui-cells weui-cells_checkbox">
        <div v-for="(one, index) in currentOptions" :key="index">
          <label class="weui-cell weui-check_label" :class="{'vux-checklist-label-left': labelPosition === 'left'}" :for="`checkbox_${uuid}_${index}`" >
            <div class="weui-cell__hd">
              <input type="checkbox" class="weui-check" :name="`vux-checkbox-${uuid}`" :value="getKey(one)" v-model="currentValue" :id="disabled ? '' : `checkbox_${uuid}_${index}`" :disabled="isDisabled(getKey(one))">
              <i class="weui-icon-checked vux-checklist-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
              <p v-html="getValue(one)"></p>
            </div>
          </label>
           <!--下拉选项-->
          <div v-if="currentValue.indexOf(getKey(one))>-1">
            <!-- 填空 -->
            <div v-if="getType(one) === 5">
              <label class="weui-cell vux-x-textarea">
                <div class="weui-cell__hd">{{questions[question.QueryOptions[getKey(one)].NextQuestionNo].QuestionText}}</div> 
                <div class="weui-cell__bd">
                  <group>
                    <x-textarea :max="100" v-model="messages" placeholder="填空" :readonly="disabled"></x-textarea>
                  </group>
                </div>
              </label>
            </div>
          <!-- 填空end -->
          <!-- 选择 -->
            <div v-else class="weui-cells weui-cells_checkbox tab">
              <label class="weui-cell weui-check_label" :class="{'vux-checklist-label-left': labelPosition === 'left'}" :for="`checkbox_${uuid}_${getKey(two)}`" v-for="(two, indexTwo) in getNextOptions(one)" :key="indexTwo">
                <div class="weui-cell__hd">
                  <input type="checkbox" class="weui-check" :name="`vux-checkbox-${uuid}`" :value="getKey(two)" @click="subCheck(one)" v-model="currentSubValue" :id="disabled ? '' : `checkbox_${uuid}_${getKey(two)}`" :disabled="isDisabled(getKey(two))">
                  <i class="weui-icon-checked vux-checklist-icon-checked"></i>
                </div>
                <div class="weui-cell__bd">
                <p v-html="getValue(two)"></p>
              </div>
            </label>
          </div>
          <!-- 选择end -->
        </div>
           <!--下拉选项end--> 
        </div>
      </div>
       <!--选择后的下拉end-->
        <!-- 填空 -->
      <div v-if="question.Type===5">
        <label class="weui-cell vux-x-textarea">
          <div class="weui-cell__hd"></div> 
            <div class="weui-cell__bd">
              <group>
                <x-textarea :max="100" v-model="messages" placeholder="填空" :readonly="disabled"></x-textarea>
              </group>
            </div>
         </label>      
      </div>
      <!-- 填空end -->
      <!--上传图片-->
      <div v-if="question.Type===7">
        <!-- 上传 -->
        <input type="file" accept="image" @change="imageChange" multiple ref="file" v-show="!disabled">
        <!-- 展示 -->
        <div class="image" v-for="(img, allImages) in images" :key="allImages">
          <img :src="img">
        </div>
      </div>
      <!--上传图片end-->
      
    </div>

  </div>
 
</template>

<script>
import uuidMixin from "./mixin_uuid";
import { getValue, getLabels, getKey, getShow } from "./object-filter";
import { Tip, Icon, Group, XTextarea } from "vux";

export default {
  name: "app-checklist",
  components: {
    Tip,
    Icon,
    Group,
    XTextarea
  },
  filters: {
    getValue,
    getKey,
    getShow
  },
  mixins: [uuidMixin],
  props: {
    name: String,
    showError: Boolean,
    title: String,
    required: {
      type: Boolean,
      default: false
    },
    examID: String,
    question: Object,
    questions: Object,
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    max: Number,
    min: Number,
    fillMode: Boolean,
    randomOrder: Boolean,
    checkDisabled: {
      type: Boolean,
      default: true
    },
    labelPosition: {
      type: String,
      default: "right"
    },
    disabled: Boolean
  },
  data() {
    return {
      currentValue: [],
      currentSubValue: [],
      messages: "",
      currentOptions: this.options,
      tempValue: "", // used only for radio mode
      tempSubValue: "", // used only for radio mode
      images: [],
      fileExist: false
      // img: null
    };
  },
  beforeUpdate() {
    if (this.isRadio) {
      const length = this.currentValue.length;
      if (length > 1) {
        this.currentValue = [this.currentValue[length - 1]];
      }
      const val = pure(this.currentValue);
      this.tempValue = val.length ? val[0] : "";
    }
  },
  created() {
    this.handleChangeEvent = true;
    if (this.value) {
      this.currentValue = this.value;
      if (this.isRadio) {
        this.tempValue = this.isRadio ? this.value[0] : this.value;
      }
    }
    this.currentOptions = this.options;
  },
  methods: {
    getValue,
    getKey,
    getShow,
    imageChange(e) {
      let $target = e.target || e.dataTransfer || e.srcElement;
      if (!$target.files.length) return;
      for (let f = 0; f < $target.files.length; f++) {
        let file = $target.files[f];
        let fileType = file.type;
        if (fileType.indexOf("image") === -1) {
          this.$utils.Alert("上传失败", "请上传正确的图片");
          return;
        }
        let url = this.getObjectURL(file);

        this.imageUpload(file).then(data => {
          this.images.push(data);
          //存地址答案
          this.fileExist = true;
          // this.img = url;
        });
      }
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
    //获取下一题
    getNextQuestionNo(one) {
      let questionNo = this.question.QueryOptions[getKey(one)].NextQuestionNo;
      return questionNo;
    },
    //获取下一题的选项
    getNextOptions(one) {
      let questionNo = this.question.QueryOptions[getKey(one)].NextQuestionNo;
      if(!questionNo) return null
      let options = this.questions[questionNo].Options;
      return options;
    },
    //获取下一题的类型
    getType(one) {
      let questionNo = this.question.QueryOptions[getKey(one)].NextQuestionNo;
      if(!questionNo) return null
      let types = this.questions[questionNo].Type;
      return types;
    },
    subCheck(one) {
      let questionNo = this.question.QueryOptions[getKey(one)].NextQuestionNo;
      this.tempSubValue = questionNo;
    },
    getFullValue() {
      const labels = getLabels(this.options, this.value);
      return this.currentValue.map((one, index) => {
        return {
          value: one,
          label: labels[index]
        };
      });
    },
    isDisabled(key) {
      if (!this.checkDisabled) {
        return false;
      }
      if (this._max > 1) {
        return (
          this.currentValue.indexOf(key) === -1 &&
          this.currentValue.length === this._max
        );
      }
      return false;
    },

    getQuestionDesc() {
      const type = this.question.Type;
      let desc = "";
      switch (type) {
        case 1:
          desc = "单选题";
          break;
        case 2:
          desc = "多选题";
          break;
        default:
          break;
      }
      return desc;
    }
  },
  computed: {
    isRadio() {
      if (typeof this.max === "undefined") {
        return false;
      } else {
        return this.max === 1;
      }
    },
    _total() {
      return this.fillMode ? this.options.length + 1 : this.options.length;
    },
    _min() {
      if (!this.required && !this.min) {
        return 0;
      }
      if (!this.required && this.min) {
        return Math.min(this._total, this.min);
      }
      if (this.required) {
        if (this.min) {
          let max = Math.max(1, this.min);
          return Math.min(this._total, max);
        } else {
          return 1;
        }
      }
    },
    _max() {
      if (!this.required && !this.max) {
        return this._total;
      }
      if (this.max) {
        if (this.max > this._total) {
          return this._total;
        }
        return this.max;
      } else {
        return this._total;
      }
    },
    valid() {
      return (
        this.currentValue.length >= this._min &&
        this.currentValue.length <= this._max
      );
    }
  },
  watch: {
    tempValue(val) {
      const _val = val ? [val] : [];
      this.$emit("input", _val);
      this.$emit(
        "on-change",
        this.examID,
        this.question.QuestionNo,
        _val,
        this.question.Type,
        this.messages
      );
    },
    value(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.currentValue)) {
        this.currentValue = newVal;
      }
    },
    options(val) {
      this.currentOptions = val;
    },
    currentValue(newVal) {
      const val = pure(newVal);
      if (!this.isRadio) {
        this.$emit("input", val);
        this.$emit(
          "on-change",
          this.examID,
          this.question.QuestionNo,
          val,
          this.question.Type,
          this.messages
        );
        let err = {};
        if (this._min) {
          if (this.required) {
            if (this.currentValue.length < this._min) {
              err = {
                min: this._min
              };
            }
          } else {
            if (
              this.currentValue.length &&
              this.currentValue.length < this._min
            ) {
              err = {
                min: this._min
              };
            }
          }
        }
        if (!this.valid && this.dirty && Object.keys(err).length) {
          this.$emit("on-error", err);
        } else {
          this.$emit("on-clear-error");
        }
      }
    },
    currentSubValue(newVal) {
      const val = pure(newVal);
      this.$emit(
        "on-change",
        this.examID,
        this.tempSubValue,
        val,
        this.question.Type,
        this.messages
      );
    }
  }
};
function pure(obj) {
  return JSON.parse(JSON.stringify(obj));
}
</script>

<style lang="less">
// @import '../../styles/weui/widget/weui_cell/weui_cell_global';
// @import '../../styles/weui/widget/weui_cell/weui_check';
// @import '../../styles/weui/icon/weui_icon_font';

// .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
//   color: @checklist-icon-active-color;
// }

.image img {
  width: 100%;
}
.tab {
  padding-left: 25px;
}
.weui-cells .vux-no-group-title {
  margin: auto;
}

.weui-cells_checkbox > div > label > * {
  pointer-events: none;
}
.vux-checklist-disabled .vux-checklist-icon-checked:before {
  opacity: 0.5;
}
.vux-checklist-label-left {
  flex-direction: row-reverse;
}
</style>
