<template>
<div>
	<div id="login">
		<form v-on:submit.prevent="submit">
                <h1 style="text-align:center;">精准康复系统</h1>
            <group label-width="70px" class="loginGroup">
            <x-input title="用户名" v-model="user.UserName" placeholder="请输入你的用户名" ref="UserNameRef" required></x-input>
            <x-input title="密码" v-model="user.Password" placeholder="请输入你的密码" type="password" ref="PasswordRef" required></x-input>
			<x-button type="primary" @click="submit">登录</x-button>
            </group>
		</form>
	</div>
</div>
</template>
<style scoped>
    .loginGroup{
        padding: 40px;
    }
</style>
<script>
    import { Group,XInput,XButton,ConfirmPlugin } from 'vux'

    export default {
        name: 'login',
        components: {
            Group,
            XInput,
            XButton,
            ConfirmPlugin,
        },
        data() {
			return {
                user:{
                    UserName:'',
                    Password:'',
                },
			}
		},
		methods: {
			submit() {
				this.$router.push('/KangFuRuHuHome')
                
                // var valid = this.$refs.UserNameRef.valid && this.$refs.PasswordRef.valid
                // if(valid){
                //     var formData = this.user;
                //     this.$api.post('Users', formData, r => {
                //         var result = r.data;
                //         console.log(r);
				//         this.$router.push('page1list')
                //     },r=>{
                //         this.$vux.alert.show({
                //             title: '登录失败',
                //             content: '用户名或密码错误。'
                //         })
                //         console.log(r);
                //     })
                // }
            },
            onCancel () {
                console.log('on cancel')
            },
            onConfirm (msg) {
                console.log('on confirm')
                if (msg) {
                    alert(msg)
                }
            },
		}
    }
</script>