<template>
  <div>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar" @click="imageChoose">
            <img :src="user.img">
            <img class="imageUpload" src="../assets/icon/imageUpload.png">
          </div>
          <p>{{user.name}}</p>
          <div class="paddingbottom"></div>
          <input type="file" accept="image" @change="imageChange" v-show="false" ref="file">
			</group>
      <group title="个人信息">
        <x-input title="姓名" v-model="user.name" text-align="right"></x-input>
        <x-input title="手机" v-model="user.phone" text-align="right"></x-input>
      </group>
      <group title="角色与区域">
        <cell title="角色">管理员</cell>
        <cell title="区域">江苏省-徐州市-铜山区</cell>
      </group>
      <group title="参与者权限">
        <checklist v-model="user.Roles" :options="Roles" label-position="left"></checklist>
      </group>
		</div>
    <div style="padding: 15px;">
      <x-button type="primary" @click.native="submit">保存</x-button>
    </div>
  </div>
</template>

<script>
import {XHeader,Group,XInput,Cell,Checklist,XButton  } from 'vux'
export default {
  name: 'profile',
    components: {
      XHeader,
      Group,
      XInput,
      Cell,
      Checklist,
      XButton,
  },
  data () {
    return {
			IsEdit:false,
			Roles:[],
			user:{
				name:'张三',
        phone:'1320000000',
        Roles:[1,2],
        img:require('@/assets/icon/avatar-male.png')
				},
      fuJuShangMenList:[],
      index:0,
      images: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$api.GetRoles({forFuJuShangMen:true}).then(res => { this.Roles = res })
    },
    imageChoose(){
      this.$refs.file.click();
    },
    imageChange(e){
      let $target = e.target || e.dataTransfer || e.srcElement;
      if (!$target.files.length) return;
      let file = $target.files[0]
      let url = this.getObjectURL(file);
      this.imageUpload(file).then((data) => {
          this.user.img=url;
        })
    },
    imageUpload(file){
      let formData = new FormData();
      formData.append('file',file);
      return this.$http.post('File',formData)
    },
    getObjectURL (file) {  
      var url = null ;   
      if (window.createObjectURL!=undefined) { // basic  
        url = window.createObjectURL(file) ;  
      } else if (window.URL!=undefined) { // mozilla(firefox)  
        url = window.URL.createObjectURL(file) ;  
      } else if (window.webkitURL!=undefined) { // webkit or chrome  
        url = window.webkitURL.createObjectURL(file) ;  
      }  
      return url ;  
    }, 
    submit(){
      this.$router.push('/profile')
    },
    newHeaderImage(newImg){
      this.headerImage = newImg;
    }
  },
  computed:{
    
  },
  watch:{
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paddingbottom{
  padding-bottom: 20px;
}
.me .infos {
    text-align: center;
    font-size: 17px;
}
.me .avatar {
    margin-top: 30px;
    margin-bottom: 10px;
    width: 70px;
    height: 70px;
		display: inline-block;
    overflow: hidden;
    position: relative;
    
}
img{
    border-radius: 50%;
	width: 100%;
    height: 100%;
}
.avatar-wrapper{
    position: relative;
}
.imageUpload {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
}
.me .nickname {
    margin-top: 16px;
}
.me .edit {
    position: absolute;
    top: 12px;
    right: 12px;
		width: 24px;
    height: 24px;
}
.me .infos-flex-item{
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-justify-content: center;
    -webkit-box-pack: center;
    justify-content: center;
    text-align: center;
}
.me .infos-flex{
		padding: 10px 0;

}
</style>
