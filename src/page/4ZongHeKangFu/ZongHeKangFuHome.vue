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
      title: "综合康复服务",
      menus: [
        {
          title: "辅具服务",
          isLink: true,
          link: "/ExamList/type/FuJuFuWu/categoryTabs",
          img: require("../../assets/icon/i1.png"),
          disabled: this.canUse
        },
        {
          title: "康复服务",
          isLink: true,
          link: "/ExamList/type/KangFuFuWu/categoryTabs",
          img: require("../../assets/icon/i2.png"),
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
    if (role === 10) {
      this.canUse = true;
    } else if (role === 11) {
      this.canAdm = true;
    }
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>

</style>
