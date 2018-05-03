<template>
<div>
  <search
    position="absolute"
    auto-scroll-to-top 
    @on-change="onSearchChange"
    @on-focus="onFocus"
    @on-cancel="onCancel"
    @on-submit="onSubmit"
    ref="search">
      <router-link v-if="canAdd" slot="right" :to="link" class="weui-search-bar__add-btn">新增</router-link>
    </search>
  <div v-if="title" class="weui-cells__title">{{title}}</div>
  <div class="weui-panel weui-panel_access">    
    <div class="weui-panel__bd">
      <app-panel-item v-for="(item,key) in filterList" :key="key" :item="item" :type="type" isLink :link="getLink(item)"></app-panel-item>
    </div> 
  </div>
</div>
</template>
<script>
import AppPanelItem from "@/components/AppPanelItem";
import { Panel, Search } from "vux";
export default {
  name: "AppPanel",
  components: {
    Panel,
    Search,
    AppPanelItem
  },
  props: {
    title: String,
    list: Array,
    type: String,
    isLink: Boolean,
    link: String,
    canAdd: Boolean
  },
  data() {
    return {
      filterList: [],
      results: [],
      value: "姓名"
    };
  },
  created() {},
  methods: {
    getLink(item) {
      let clink = (clink = "/" + this.link + "/" + item.ID);
      if (this.type === "exam") {
        clink += "/" + item.Exam.ID + "/" + item.State;
      } else if (this.type === "user") {
        clink = "/" + this.link + "/" + item.ID;
      } else if (this.type === "info") {
        clink = "/" + this.link + "/" + item.ID;
      } else if (this.type === "no") {
        clink = this.link + "/" + item.ID;
      }
      return clink;
    },
    onSearchChange(val) {
      this.filterList = this.list.filter(v => {
        return v.Name.indexOf(val) > -1;
      });
    },
    onFocus() {
      console.log("on focus");
    },
    onCancel() {
      this.filterList = this.list;
    },
    onSubmit() {
      this.$refs.search.setBlur();
    }
  },
  watch: {
    list() {
      this.filterList = this.list;
    }
  }
};
</script>
<style scoped>
.weui-search-bar__add-btn {
  margin-left: 10px;
  line-height: 28px;
  color: #09bb07;
  white-space: nowrap;
}
</style>
