<template>
  <div>
    <div v-show="display">
    <cell title="数量">
      <inline-x-number style="display:block;" :min="1" width="50px" button-style="round" v-model="assistiveNumber"></inline-x-number>
    </cell>
    </div>
     <div v-show="!display">
    <cell title="数量">
      <x-input v-model="showValue" text-align="right" :disabled="true"></x-input>
    </cell>
    </div>
  </div>
</template>

<script>
import { Cell, InlineXNumber, XInput } from "vux";

export default {
  name: "app-number",
  components: {
    Cell,
    InlineXNumber,
    XInput
  },
  props: {
    item: Object,
    title: String,
    jian: Number,
    display: Boolean,
    disabledID: String,
    examID: String,
    state: String
  },
  data() {
    return {
      assistiveNumber: 1,
      showValue: 0,
      State: this.state
    };
  },
  beforeUpdate() {},
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      var it = this.item;

      var list = await this.$api.getAssistNumber(
        "?ExamID=" + this.examID + "&DisabledID=" + this.disabledID
      );

      if (this.item.key) {
        for (let k = 0; k < list.length; k++) {
          if (list[k].ID === this.item.key) {
            this.showValue = list[k].Number;
            this.assistiveNumber = list[k].Number;
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.item.length; j++) {
            if (
              list[i].ID === this.item[j].key &&
              list[i].Name === this.item[j].value
            ) {
              this.showValue = list[j].Number;
              this.assistiveNumber = list[k].Number;
            }
          }
        }
      }
    }
  },
  computed: {},
  watch: {
    assistiveNumber(newVal) {
      const val = pure(newVal);
      this.$emit("on-change", this.title, this.jian, val);
    }
  }
};
function pure(obj) {
  return JSON.parse(JSON.stringify(obj));
}
</script>

<style lang="less">
</style>
