<template>
  <cell title="数量">
    <inline-x-number style="display:block;" :min="1" width="50px" button-style="round" v-model="assistiveNumber"></inline-x-number>
  </cell>
</template>

<script>
import { Cell, InlineXNumber } from "vux";

export default {
  name: "app-number",
  components: {
    Cell,
    InlineXNumber
  },
  props: {
    title: String,
    jian: Number
  },
  data() {
    return {
      assistiveNumber: 1
    };
  },
  beforeUpdate() {},
  created() {},
  methods: {},
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
