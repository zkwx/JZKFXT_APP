<template>
  <div>
    <group :title="title">
      <cell v-for="(item,key) in menus" :key="key" :disabled="item.disabled" :title="item.title" :isLink="item.isLink" :link="item.link">
        <img slot="icon" :src="item.img" class="cell-icon">
      </cell>
    </group>
  </div>
</template>
<script>
import { Group, Cell } from "vux";
export default {
  components: {
    Group,
    Cell
  },
  data() {
    return {
      canUse: false,
      canAdm: false,
      title: "机构评估与审核",
      menus: [
        {
          title: "辅具审核",
          isLink: true,
          link: "/ExamList/type/FuJuShenHe/categoryTabs",
          img: require("../../assets/icon/i1.png"),
          disabled: this.canUse
        },
        {
          title: "假肢矫形器审核",
          isLink: true,
          link: "/ExamList/type/JiaZhiJiaoXingQiShenHe/jiaZhiJiaoXingQiTabs",
          img: require("../../assets/icon/i2.png"),
          disabled: this.canUse
        },
        {
          title: "无障碍审核",
          isLink: true,
          link: "/ExamList/name/WuZhangAiShenHe/wuZhangAiTabs",
          img: require("../../assets/icon/i3.png"),
          disabled: this.canUse
        },
        {
          title: "机构评估",
          isLink: true,
          link: "/ExamList/type/JiGouPingGu/categoryTabs",
          img: require("../../assets/icon/i3.png"),
          disabled: this.canAdm
        }
      ]
    };
  },
  beforeCreate() {
    const userKey = localStorage.getItem("loginUserBaseInfo");
    var obj = JSON.parse(userKey);
    let id = obj.I;
    let role = obj.R;
    if (role === 9) {
      this.canUse = true;
      this.canAdm = false;
    }
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>

</style>
