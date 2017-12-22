<template>
  <div>
    <x-header :left-options="{showBack:false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      精准康复入户
      <router-link slot="right" to="/KangFuRuHuDetail"><i class="fa fa-plus fa-lg"></i></router-link>
    </x-header>
    <app-panel :list="list" :link="link"></app-panel>
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
      link:"KangFuRuHuDetail",
      list: [],
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$api.GetDisabledInfoes().then(res => { this.list = res })
    }
  }
}
</script>