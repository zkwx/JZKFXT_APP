<template>
  <div>
    <!-- <x-header :left-options="{showBack:false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      精准康复入户
      <router-link slot="right" to="/KangFuRuHuDetail"><i class="fa fa-plus fa-lg"></i></router-link>
    </x-header> -->
    <app-panel title="精准康复入户患者列表" :list="list" :link="link" type="info"></app-panel>
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
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>