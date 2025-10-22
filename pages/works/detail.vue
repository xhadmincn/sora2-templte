<template>
	<view class="text-white">
		<view class="h-250 w-p-100">
			<video :src="info.result_url" class="w-p-100 h-p-100"></video>
		</view>
		<view class=" mt-12 px-8">
			<view class="round-8 bg-black-1 px-10 py-12">
				<view class="flex flex-y-center gap-6 ">
					<text class="iconfont icon-miaoshu fw-400"></text>
					<text>描述内容</text>
				</view>
				<view class="mt-12 text-grey fs-14">
					{{info.prompt}}
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_banner')">
				<ad :unit-id="WEBCONFIG?.wx_banner" ad-theme="white">
				</ad>
			</view>
			<!-- #endif -->

			<view class="round-8 bg-black-1 px-10 py-12 mt-12" v-if="info.image_url">
				<view class="flex flex-y-center gap-6 ">
					<text class="iconfont icon-tupian fw-400"></text>
					<text>参考图片</text>
				</view>
				<image :src="info.image_url" class="w-100 h-100 round-12"></image>
			</view>


			<view class="round-8 bg-black-1 px-10 py-12 mt-12">
				<view class="flex flex-y-center gap-6 ">
					<text class="iconfont icon-xiangqingon fw-400"></text>
					<text>基本信息</text>
				</view>
				<view class="flex flex-x-space-between fs-14 py-6 ">
					<text class="text-999">任务ID</text>
					<view style="max-width: 140px;" class="overflow-hidden">
						<text class="text-ellipsis-1">{{info.task_id}}</text>
					</view>
				</view>
				<view class="flex flex-x-space-between fs-14 py-6 ">
					<text class="text-999">生成模型：</text>
					<view style="max-width: 140px;" class="overflow-hidden">
						<text class="text-ellipsis-1">Sora-2</text>
					</view>
				</view>
				<view class="flex flex-x-space-between fs-14 py-6 ">
					<text class="text-999">消耗次数</text>
					<view style="max-width: 140px;" class="overflow-hidden">
						<text class="text-ellipsis-1">1次</text>
					</view>
				</view>
				<view class="flex flex-x-space-between fs-14 py-6 ">
					<text class="text-999">创建时间</text>
					<view style="max-width: 140px;" class="overflow-hidden">
						<text class="text-ellipsis-1">{{info.create_at}}</text>
					</view>
				</view>

				<view class="flex flex-x-space-between fs-14 py-6 " v-if="info.status==1">
					<text class="text-999">完成时间</text>
					<view style="max-width: 140px;" class="overflow-hidden">
						<text class="text-ellipsis-1">{{info.complete_at}}</text>
					</view>
				</view>
			</view>

			<view class="grid-columns-3 gap-12 fs-14 mt-12 pb-20" v-if="info.status==1">
				<view class="bg-black-1 round-8 flex flex-center py-8 gap-6"
					@click="downloadPopup.downloadStart(info.result_url)">
					<text class="iconfont icon-xiazai text-success fs-18"></text>
					<text>下载视频</text>
				</view>
				<view class="bg-black-1 round-8 flex flex-center py-8 gap-6" @click="re">
					<text class="iconfont icon-zhongxinbofang text-wait fs-18"></text>
					<text>重新生成</text>
				</view>
				<view class="bg-black-1 round-8 flex flex-center py-8 gap-6" @click="del">
					<text class="iconfont icon-shanchu text-warning fs-18"></text>
					<text>删除视频</text>
				</view>
			</view>
		</view>
		<y-download ref="downloadPopup"></y-download>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue';
	import { $http, $page, $tool } from '@/utils';
	const downloadPopup = ref(null)
	const info = ref({})
	onLoad((e) => {
		getDetail(e.id)
	})
	const getDetail = (id) => {
		$http.get('Works/getDetail', { id: id }).then(res => {
			info.value = res.data
		})
	}
	const re = () => {
		const data = JSON.stringify(info.value);
		$page.reLaunch('/pages/index/index?data=' + data);
	}
	const del = () => {
		uni.showModal({
			title: '确认删除',
			content: '是否确认删除？',
			success(res) {
				if (res.confirm) {
					$http.post('Works/del', { id: info.value.id }).then(res => {
						$tool.toast('删除成功');
						setTimeout(() => {
							$page.back();
						}, 300)
					})
				}
			}
		})
	}
</script>

<style>
	.text-warning {
		color: #ffb464;
	}

	.text-success {
		color: #22dc5a;
	}

	.text-error {
		color: #fd394d;
	}

	.text-wait {
		color: #0877FF;
	}
</style>