<template>
	<view class=" pb-safe-area text-white ">
		<z-paging v-show="!preview" ref="paging" v-model="list" @query="getList">
			<template #top>
				<!-- #ifdef MP-WEIXIN -->
				<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_video_new')">
					<ad :unit-id="WEBCONFIG?.wx_video_new" ad-theme="white">
					</ad>
				</view>
				<!-- #endif -->
			</template>
			<view class="grid-columns-3 gap-3">
				<view class="fixed top-12 right-12 round-30 box px-20 py-10 " @click="active=!active">
					{{active?'取消':'选择'}}
				</view>
				<view class="fixed bottom-12 left-12 round-30 box px-20 py-10" v-if="active==true" @click.stop="all">全选
				</view>
				<view class="fixed bottom-12 right-12 round-circle box flex flex-center  w-60 h-60 " v-if="active==true"
					@click.stop="delAll">
					<text class="iconfont icon-shanchu fs-30"></text>
				</view>
				<view class="h-150 w-p-100 relative" v-for="(item,index) in list" @click="previewImg(item,index)">
					<image :src="item.url" class="h-150 w-p-100" mode="aspectFill"></image>
					<view class="w-16 h-16 border-white flex flex-center round-circle box absolute bottom-6 right-6"
						v-if="active==true" :class="ids?.includes(item.id)?'bg-blue-1':''" @click.stop="select(item)">
						<text class="iconfont icon-gouxuan fs-12" v-if="ids.includes(item.id)"></text>
					</view>
				</view>
			</view>
		</z-paging>
		<view class="vh-100 flex flex-center bg-black" v-if="preview" @click="preview=false">
			<swiper class="w-p-100 h-p-100" :current="currentIndex" @change="onSwiperChange" circular>
				<swiper-item v-for="(url, index) in tmpImg" :key="index" class="flex flex-center">
					<image :src="url" mode="widthFix" class="max-w-p-100" @click.stop=""></image>
				</swiper-item>
			</swiper>

			<!-- 底部按钮栏 -->
			<view class="fixed bottom-12 left-0 right-0 p-12 grid-columns-2 gap-12">
				<view class="bg-black-1 round-12 py-12 text-center" @click.stop="del">
					删除素材
				</view>
				<view class="gradient py-12 text-center round-12" @click.stop="use">
					立即使用
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { $http, $page, $tool } from '@/utils';
	import { onLoad } from '@dcloudio/uni-app'
	import { useInterstitialAd } from '@/composables/useInterstitialAd.js';
	
	const active = ref(false)
	const preview = ref(false)
	const paging = ref(null)
	const list = ref([])
	const ids = ref([])
	const getList = (page, limit = 20) => {
		$http.get('Material/getList', { page, limit }).then(res => {
			paging.value.complete(res.data);
		})
	}

	const currentIndex = ref(0)
	const tmpImg = ref([])
	const previewImg = (item, index) => {
		if (active.value) {
			select(item);
			return;
		};
		preview.value = true;
		currentIndex.value = index
		tmpImg.value = list.value.map(item => item.url)
	}
	const onSwiperChange = (e) => {
		currentIndex.value = e.detail.current;
	};
	const del = () => {
		const id = list.value[currentIndex.value].id
		uni.showModal({
			title: '确认删除',
			content: '是否确认删除?',
			success(res) {
				if (res.confirm) {
					$http.post('Material/del', { ids: [id] }).then(res => {
						$tool.toast('删除成功');
						paging.value.reload();
					})
				}
			}
		})
	}
	const delAll = () => {
		if (ids.value.length < 1) {
			return $tool.toast('最少选择一项')
		}
		uni.showModal({
			title: '确认删除',
			content: '是否确认删除?',
			success(res) {
				if (res.confirm) {
					$http.post('Material/del', { ids: ids.value }).then(res => {
						$tool.toast('删除成功');
						paging.value.reload();
					})
				}
			}
		})
	}

	const all = () => {
		ids.value = list.value.map(item => item.id)
	}

	const use = () => {
		let pages = getCurrentPages();
		console.log(pages.length)
		uni.$emit('meaterial', list.value[currentIndex.value].url);
		uni.navigateBack({
			delta:pages.length - 1
		});
	}
	const select = (item) => {
		const index = ids.value.indexOf(item.id)
		if (index != -1) {
			ids.value.splice(index, 1)
		} else {
			ids.value.push(item.id)
		}
	}
	
	
	onLoad(()=>{
		const { initAd } = useInterstitialAd(WEBCONFIG?.value.wx_interstitial_time)
		initAd(WEBCONFIG?.value.wx_interstitial);
	})
</script>

<style>
	.box {
		background-color: rgb(0, 0, 0, 0.5);
		z-index: 96;
		backdrop-filter: blur(5px);
	}
</style>