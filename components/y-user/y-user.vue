<template>
	<y-popup ref='popup' mode="bottom" round="8" backgroundColor="#fff" :zIndex="999">
		<view class="p-18 text-black text-center">
			<view class=" fs-20 fw-600 ">授权信息</view>
			<button class="btn-normal" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<view class="py-17 bg-grey-1 round-12 text-666  mt-20" v-if='form.avatar==""'>点击授权头像</view>
				<image v-else :src="form.avatar" class="w-70 h-70 round-circle"></image>
			</button>

		

			<view class="py-17 bg-grey-1 round-12 text-666 mt-10">
				<input placeholder="授权昵称" class="text-black" type="nickname" @change='change' />
			</view>
			<view class="gradient round-8 py-12 text-white text-center mt-20" @click="submit">
				授权信息
			</view>
		</view>
		<view @click="popup.close()"
			class=" w-30 h-30  round-circle flex flex-center absolute right-10 top-18"
			style=" background: rgba(116,116,128,0.08);;">
			<text class="iconfont icon-guanbi fs-14 text-333"></text>
		</view>
	</y-popup>
</template>

<script setup>
	import { ref } from 'vue';
	import {  useRefs, useUserStore } from '@/stores'
	import { $http, $page, $tool, useStorage } from '@/utils'
	const { get, set } = useStorage()
	const { setUserInfo, setToken, getUserInfo } = useUserStore()
	const { USERINFO } = useRefs(useUserStore())
	const popup = ref(null)
	const form = ref({
		nickname: '',
		avatar: '',
		mobile: ''
	})
	const avatarStatus = ref(false)

	const open = () => {
		popup.value.open();
	}
	defineExpose({ open })

	const getPhone = (e) => {
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			$http.post('User/getPhone', e.detail).then(res => {
				form.value.mobile = res.data.phoneNumber
			})
			return;
		}
		uni.showModal({
			title: '错误提示',
			content: e.detail.errMsg
		})
	}
	const selectImg = () => {
		uni.chooseImage({
			count: 1,
			success(res) {
				avatarStatus.value = true
				form.value.avatar = res.tempFilePaths[0]
			}
		})
	}
	const onChooseAvatar = (e) => {
		avatarStatus.value = true
		form.value.avatar = e.detail.avatarUrl
	}

	const change = (e) => {
		form.value.nickname = e.detail.value
	}
	const uploadAvatar = async () => {
		try {
			const res = await $http.upload('upload/Upload', {
				filePath: form.value.avatar,
				name: 'file',
				is_hide: 1
			});
			form.value.avatar = res.data.url;
		} catch (error) {
			console.error('头像上传失败', error);
			throw new Error('头像上传失败');
		}
	};

	const submit = async () => {
		try {
			if (avatarStatus.value) {
				await uploadAvatar();
			}
			await $http.post('User/saveUser', form.value);
			uni.showToast({
				title: '修改成功',
				icon: 'none'
			});
			getUserInfo();
			popup.value.close();
		} catch (error) {
			console.error('提交失败', error);
			uni.showToast({
				title: error.message || '提交失败',
				icon: 'none'
			});
		}
	};
</script>

<style>
	.bg-blue {
		background-color: #3D5CFF;
	}
</style>