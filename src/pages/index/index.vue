<template>
	<view class="content">
		<form @submit="formSubmit" class="form">
			<view class="uni-form-item uni-column">
				<input class="uni-input" name="tel" v-model="tel" placeholder="手机号" />
				<input class="uni-input" name="smsCode" v-model="smsCode" placeholder="验证码" />
				<button form-type="submit">登录</button>
			</view>
		</form>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loginOrRegForMoblie } from '@/api/index';
const tel = ref<string>('18171171929');
const smsCode = ref<string>('999999');
const formSubmit = (e: any): void => {
	login('18171171929', '999999');
};
const login = async (tel: string, smsCode: string) => {
	const data: any = await loginOrRegForMoblie(tel, smsCode);
	const ticket: string = data?.data || '';
	localStorage.setItem('ticket', ticket);
	uni.navigateTo({
		url: '/pages/allCategoryPages/allCategoryPages',
		animationType: 'pop-in',
		animationDuration: 200
	});
};
</script>

<style lang="scss">
.content {
	display: flex;
	.form {
		width: 90vw;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	.uni-input {
		border: 1px solid #eee;
		height: 40px;
		line-height: 40px;
		margin-bottom: 10px;
		padding: 0 5px;
	}
}
</style>
