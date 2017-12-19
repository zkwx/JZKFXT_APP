<template>
  <div id="app"  style="height:100%;">
    <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">
      <router-view slot="default" class="router-view"></router-view>
      <app-footer slot="bottom" v-if="$route.meta.navShow"></app-footer>
    </view-box>
  </div>
</template>

<script>
  import AppFooter from './components/AppFooter'
  import { ViewBox } from 'vux'
  export default {
    name: 'app',
    components: {
      AppFooter,
      ViewBox
    },
    data(){
      return {
      }
    }
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';

body {
  background-color: #fbf9fe;
}

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  color: black;
  font-weight: bold;

}

.icon{
  width: 1em;
  height: 1em;
  margin-left:10px;
}
.cell-icon{
  width: 24px;
  height: 24px;
  margin-right: 10px;
  display:block;
}
</style>