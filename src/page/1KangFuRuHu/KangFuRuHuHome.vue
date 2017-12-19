<template>
  <div>
    <x-header :left-options="{showBack:false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      精准康复入户
      <router-link slot="right" to="/KangFuRuHuDetail"><i class="fa fa-plus fa-lg"></i></i></router-link>
    </x-header>
    <app-panel :list="list"></app-panel>
  </div>
</template>
<script>
import { XHeader } from 'vux'
import AppPanel from '@/components/AppPanel'

export default {
  components: {
    XHeader,
    AppPanel
  },
  data () {
    return {
      sex:{
        male:require("../../assets/icon/male.png"),
        female:require("../../assets/icon/male.png"),
      },
      list: [],
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$api.GetDisabledInfoes({forListType:'入户'}).then(res => { this.list = res })
    }
  }
}
</script>