<template>
	<view>
		<z-paging ref="paging" @query="getList" v-model="list">
			<template #top>
				<view class="grid-columns-3 gap-18 fs-18  p-12 text-white">
					<view class="round-30 flex flex-center gap-4 py-9" v-for="(item,index) in tabs" :key='index'
						:class="type==item.value?'gradient':'bg-black-1'" @click="onChange(item)">
						<text>{{item.name}}</text>
						<view class="w-20 h-20 fs-14 round-circle flex flex-center"
							style="background: rgba(0,0,0,0.2);">
							{{item.number}}
						</view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_video')">
					<ad :unit-id="WEBCONFIG?.wx_video" ad-theme="white">
					</ad>
				</view>
				<!-- #endif -->
			</template>
			<view class="px-12 py-6 text-white" v-for="(item, index) in list" :key="item.id"
				@click="$page.open('/pages/works/detail?id='+item.id)">
				<view class="p-10 round-8 bg-black-1 flex flex-y-center gap-12">
					<view class="img flex flex-center round-8 overflow-hidden relative"
						:style="`background-image: url('${item.cover}');`" @click.stop="open(item)">
						<view class="w-30 h-30 round-circle flex flex-center" style="background-color: rgba(0,0,0,0.2);"
							v-if="item.status==1">
							<text class="iconfont icon-bofang  text-white ml-4"></text>
						</view>
						<view class="w-30 h-30 round-circle flex flex-center" style="background-color: rgba(0,0,0,0.2);"
							v-if="item.status==0">
							<yLoading></yLoading>
						</view>
						<view v-if="item.status==2 " class="flex flex-column gap-4 flex-y-center">
							<text class="iconfont icon-cuowu text-error fs-20"></text>
							<text class="fs-12 text-error">生成失败</text>
						</view>
					</view>
					<view class="flex flex-column gap-8 flex-1 py-2">
						<text class="fs-14 text-ellipsis-1">{{ item.prompt }}</text>
						<text class="fs-14" :class="statusClass(item.status)">
							{{ statusText(item.status) }}
						</text>
						<view class="flex flex-y-center flex-x-space-between">
							<text class="fs-12 text-666">{{ item.create_at }}</text>
							<view class="flex gap-6">
								<view v-for="icon in iconList(item.status)" :key="icon.name" class="icon"
									@click.stop="handClick(item,icon)">
									<text class="iconfont" :class="[icon.name]" :style="{ color: icon.color }"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		<y-download ref="downloadPopup"></y-download>
		<y-popup ref="previewPopup" mode="bottom" round='12'>
			<view class="vh-55 p-20 text-center">
				<view class="mb-10">
					<text class="fs-18 fw-600 text-black">视频预览</text>
				</view>
				<video :src="selectInfo.result_url" class="w-p-100 h-p-100"></video>
			</view>
			<view @click="previewPopup.close()"
				class=" w-30 h-30 text-grey-1 round-circle flex flex-center absolute right-10 top-18"
				style="background: rgba(116,116,128,0.08);;">
				<text class="iconfont icon-guanbi text-333 fs-14 fw-600"></text>
			</view>
		</y-popup>
	</view>
</template>

<script setup>
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	import { ref } from 'vue';
	import { $http, $page, $tool } from '@/utils';
	import yLoading from "./modules/y-loading.vue";
	import { onShow, onPageScroll, onReachBottom,onLoad } from '@dcloudio/uni-app'
	import { useInterstitialAd } from '@/composables/useInterstitialAd.js';
	const type = ref(0)
	const paging = ref(null)
	const list = ref([])
	useZPaging(paging)

	const downloadPopup = ref(null)
	const tabs = ref([
		{ name: '全部', number: 0, value: 0 },
		{ name: '生成中', number: 0, value: 1 },
		{ name: '已完成', number: 0, value: 2 },
	])
	const onChange = (e) => {
		type.value = e.value
		paging.value.reload()
	}
	const selectInfo = ref({
		result_url: ''
	})
	const previewPopup = ref(null)

	const getList = (page, limit) => {
		uni.showLoading({
			title:'加载中...'
		})
		$http.get('Works/getList', { page, limit, type: type.value }).then(res => {
			paging.value.complete(res.data);
		})
	}
	const getDataCount = () => {
		const map = {
			0: 'total',
			1: 'progress',
			2: 'complete'
		};
		$http.get('Works/getDataCount').then(res => {
			tabs.value.forEach(item => {
				const key = map[item.value];
				item.number = res.data[key];

			});

		})
	}

	const open = (item) => {
		if (item.status != 1) return;
		selectInfo.value = item;
		previewPopup.value.open()
	}
	const handClick = (item, icon) => {
		if (icon.value == 1) {
			if (item.status != 1) return;
			downloadPopup.value.downloadStart(item.result_url)
		}
		if (icon.value == 2) {
			const data = JSON.stringify(item);
			$page.reLaunch('/pages/index/index?data=' + data);
		}
		if (icon.value == 3) {
			uni.showModal({
				title: '确认删除',
				content: '是否确认删除？',
				success(res) {
					if (res.confirm) {
						del(item.id)
					}
				}
			});
		}
	}

	const del = (id) => {
		$http.post('Works/del', { id: id }).then(res => {
			$tool.toast('删除成功');
			paging.value.reload()
		})
	}
	const statusText = (status) => {
		switch (status) {
			case 0:
				return '生成中...'
			case 1:
				return '已完成'
			case 2:
				return '失败'
			default:
				return ''
		}
	}

	const statusClass = (status) => {
		return {
			'text-warning': status === 0, // 黄色
			'text-success': status === 1, // 绿色
			'text-error': status === 2, // 红色
		}
	}

	// 动态图标配置
	const iconList = (status) => {
		const baseIcons = [
			{ name: 'iconfont icon-xiazai', color: '#22DC5A', value: 1 },
			{ name: 'iconfont icon-zhongxinbofang', color: '#0877FF', value: 2 },
			{ name: 'iconfont icon-shanchu', color: '#FD394D', value: 3 },
		]
		// 生成中/失败时用灰色
		return status === 1 ?
			baseIcons :
			baseIcons.map((i) => ({ ...i, color: '#666' }))
	}

	onShow(() => {
		getDataCount();
		if (paging.value) {
			paging.value.reload();
		}
	})
	
	
	onLoad(()=>{
		const { initAd } = useInterstitialAd(WEBCONFIG?.value.wx_interstitial_time)
		initAd(WEBCONFIG?.value.wx_interstitial);
	})
</script>

<style>
	.img {
		width: 176rpx;
		height: 176rpx;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.text-warning {
		color: #ffb464;
	}

	.text-success {
		color: #22dc5a;
	}

	.text-error {
		color: #fd394d;
	}

	.icon {
		background-color: #2e2d44;
		width: 52rpx;
		height: 52rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}
</style>