<template>
	<view class="text-white p-20">
		<text class="fs-20 fw-bold">{{detail?.title}}</text>
		<view class="flex fs-12 flex-x-space-between py-20 text-666">
			<text>{{detail?.create_at}}</text>
			<view class="flex flex-y-center grid-gap-2">
				<text class="iconfont icon-yanjing"></text>
				<text>{{detail?.view}}</text>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="mt-20 overflow-hidden" v-if="WEBCONFIG?.wx_ad_status.includes('wx_banner')">
			<ad :unit-id="WEBCONFIG?.wx_banner" ad-theme="white">
			</ad>
		</view>
		<!-- #endif -->
		<view class="text-999">
			<mp-html :content='detail?.content'></mp-html>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import { $page } from '@/utils';
	import { $http } from '@/utils';
	import { useRefs,useWebConfigStore } from '@/stores'
	const { WEBCONFIG } = useRefs(useWebConfigStore())
	const detail = ref()
	onLoad((e) => {
		getTags(e.name)
	})


	const getTags = (e) => {
		$http.get('Tags/getDetail', { name: e }).then(res => {
			detail.value = res.data
			uni.setNavigationBarTitle({
				title:res.data.title
			})
		})
	}
</script>

<style>
	page {
		letter-spacing: 0px;
	}
</style>