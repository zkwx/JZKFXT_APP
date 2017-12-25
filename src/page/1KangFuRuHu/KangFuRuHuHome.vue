<template>
  <div>
    <app-panel :title="title" :list="list" :link="link" type="info"></app-panel>
  </div>
</template>
<script>
import AppPanel from '@/components/AppPanel'

export default {
  components: {
    AppPanel
  },
  data () {
    return {
      title:"精准康复入户患者列表",
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
    },
  }
}
</script>