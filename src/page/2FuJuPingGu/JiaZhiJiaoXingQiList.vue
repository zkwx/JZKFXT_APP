<template>
  <div>
    <x-header
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      :left-options="{showBack: false}">
      康复人员列表
      <!-- <a slot="right"><i class="fa fa-search fa-lg"></i></a> -->
      <router-link slot="right" to="page1detail"><i class="fa fa-plus fa-lg"></i></i></router-link>
    </x-header>
    <panel header="人员列表" :list="list" type="1"></panel>
  </div>
</template>
<script>
import { XHeader,Panel } from 'vux'
export default {
  components: {
    XHeader,
    Panel
  },
  data () {
    return {
      list: [],
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$api.get('DisabledInfoes?forList=true', null, r => {
        this.list = r
      })
    }
  }
}
</script>