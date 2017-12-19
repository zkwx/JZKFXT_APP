<template>
  <div>
    <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      个人中心
		<router-link slot="right" to="/profile/edit">设置</router-link>
    </x-header>
		<div class="me">
			<group class="infos" gutter=0>
          <div class="avatar">
            <img src="/static/img/avatar.png">
          </div>
					<p>{{user.name}}</p>
					<p>{{user.phone}}</p>
					<flexbox :gutter="0" class="infos-flex">
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>1</p>
								<label>进行中患者</label>
							</div>
						</flexbox-item>
						<flexbox-item class="infos-flex-item vux-1px-r">
							<div>
								<p>2</p>
								<label>已完成患者</label>
							</div>
						</flexbox-item>
					</flexbox>
			</group>
			<group title="角色与区域">
				<cell title="角色">管理员</cell>
				<cell title="区域">江苏省-徐州市-铜山区</cell>
			</group>
			<group title="参与者权限">
				<checklist v-model="user.Roles" :options="Roles" disabled label-position="left"></checklist>
			</group>
      <x-button v-if="IsEdit" type="primary" @click.native="submit">保存</x-button>
		
		</div>
  </div>
</template>

<script>
import {XHeader,Group,Flexbox,FlexboxItem,Cell,Checklist,XButton  } from 'vux'
export default {
  name: 'profile',
    components: {
      XHeader,
			Flexbox,
			FlexboxItem,
      Group,
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
        img:null
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
      this.$api.GetRoles({forFuJuShangMen:true}).then(res => { this.Roles = res.slice(0,2) })
    },
    imageChoose(){
      this.$refs.file.click();
    },
    imageChange(e){
      // let files = e.target.files || e.dataTransfer.files;
      // if (!files.length) return;
      // this.panel = true;
      // this.picValue = files[0];
       
      // this.url = this.getObjectURL(this.picValue);
      // //每次替换图片要重新得到新的url
      // if(this.cropper){
      //   this.cropper.replace(this.url);
      // }
      // this.panel = true;
      // this.headerImage=e.
    },
    imageUpload(e,b){
      this.user.img = e.target.files[0]
      
    },
    submit(){
      this.IsEdit=false
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
