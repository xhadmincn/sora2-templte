<template>
	<view class="index-bg vh-100 text-white ">
		<y-nav>
			<view class="flex gap-12 flex-y-center px-16" @click="$page.open('/pages/user/index')">
				<image :src="USERINFO?.avatar?USERINFO?.avatar:WEBCONFIG?.web_logo" class="avatar round-circle"></image>
				<text class="fs-17 ">{{USERINFO?.nickname?USERINFO?.nickname:WEBCONFIG?.web_name}}</text>
			</view>
		</y-nav>
		<view class="py-20 px-8 " :style="`padding-bottom: ${70 + safeBottom}px !important;`">
			<view class="flex flex-center">
				<view class="w-230">
					<ySetup v-model="form.type"></ySetup>
				</view>
			</view>
			<view class="mt-20 round-12 bg-black-1 py-18 px-12 flex flex-y-center gap-2" v-if="form.type==2">
				<text class="fw-600 ">产品名称：</text>
				<input placeholder="请输入您的产品名称..." v-model="form.product_name" />
			</view>
			<view class="mt-20">
				<yTitle>
					<template #icon>
						<text class="iconfont icon-miaoshu fw-400"></text>
					</template>
					描述你的视频
				</yTitle>

				<!-- #ifdef MP-WEIXIN -->
				<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_video')">
					<ad :unit-id="WEBCONFIG?.wx_video" ad-theme="white">
					</ad>
				</view>
				<!-- #endif -->

				<view class="mt-12 bg-black-1 round-12  p-8 pb-16 fs-14">
					<view class="bg-black-2 px-10 py-12 round-12 ">
						<textarea class="w-p-100 h-150" :maxlength="WEBCONFIG?.max_prompt" v-model="form.prompt"
							placeholder="详细描述你想创建的视频场景...例如：未来科技城市，飞行器在高楼间穿梭，全息投影广告闪烁，机器人在街道上行走，充满科幻感的场景..."></textarea>
					</view>
					<view class="flex flex-y-center flex-x-space-between mt-16">
						<text class="text-999 ">{{form.prompt.length}} /{{WEBCONFIG?.max_prompt}}</text>
						<view class="gradient py-9 px-12 flex flex-center gap-4 round-6 " @click="setPrompt"
							v-if="promptList.length>0">
							<text class="iconfont icon-suiji"></text>
							<text class="fs-15">随机提示词</text>
						</view>
					</view>
				</view>
			</view>

			<view class="mt-20">
				<yTitle>
					<template #icon>
						<text class="iconfont icon-tupian fw-400"></text>
					</template>
					参考图片(可选)
				</yTitle>

				<view class="mt-12 bg-black-1 round-12  p-8 ">
					<view class="h-130 w-p-100 round-12 border-blue flex flex-center p-2"
						style="border-style: dashed !important;" @click="uploadImage">
						<view class="flex-1 h-p-100 flex-column gap-4 flex flex-center " v-if="!form.image_url">
							<text class="iconfont icon-tianjia fs-24 text-blue"></text>
							<text class="fs-14 text-blue">添加图片</text>
						</view>
						<image v-else :src="form.image_url" class="h-p-100" mode="heightFix"></image>
					</view>
					<view class="flex flex-x-space-between flex-y-center mt-12">
						<view class="fs-12 mt-12 text-999">*图片不可含人物，否则视频生成会失败</view>
						<view class="gradient py-9 px-12 flex flex-center gap-4 round-6 " @click="toM">
							<text class="iconfont icon-lishisucai fs-18"></text>
							<text class="fs-15">历史素材</text>
						</view>
					</view>
				</view>
			</view>

			<view class="mt-20">
				<yTitle>
					<template #icon>
						<text class="iconfont icon-shipin fw-400"></text>
					</template>
					视频比例
				</yTitle>
				<view class="mt-12 flex flex-y-center text-center gap-8 fs-18 ">
					<view class="flex-1 round-8  py-11" @click="form.aspectRatio=item.value"
						:class="form.aspectRatio==item.value?'gradient':'bg-black-1'" v-for="(item,index) in ratioList"
						:key='index'>
						{{item.label}}
					</view>
				</view>
			</view>

			<view class="mt-20">
				<yTitle>
					<template #icon>
						<text class="iconfont icon-zonghaoshishichang fw-400"></text>
					</template>
					视频时长
				</yTitle>
				<view class="mt-12 flex flex-y-center text-center gap-8 fs-18 ">
					<view class="flex-1 round-8  py-11" @click="onChangeTime(item)" :class="{
										  'disable': item.disable,
										  'gradient': form.duration == item.value,
										  'bg-black-1': form.duration != item.value
										}" v-for="(item,index) in durationList" :key='index'>
						{{item.label}}
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_banner')">
				<ad :unit-id="WEBCONFIG?.wx_banner" ad-theme="white">
				</ad>
			</view>
			<!-- #endif -->
		</view>
		<y-bottom>
			<view class="flex flex-y-center gap-20 px-16 pt-7">
				<view class="flex flex-column gap-4 flex-y-center" @click="$page.open('/pages/works/index')">
					<text class="iconfont icon-wodezuopin text-blue fs-24"></text>
					<text class="fs-12">我的作品</text>
				</view>
				<view class="flex-1  py-14 gradient round-8 text-center" @click="handGenVideo">
					立即生成
				</view>
			</view>
		</y-bottom>



		<y-popup ref="adPopup" mode='bottom' backgroundColor="#fff" round='12'>
			<view class="py-18 px-30 ">
				<view class="text-center fs-20 fw-600 text-black">看视频领创作次数</view>
				<view class="flex relative flex-x-space-evenly my-18 pb-12">
					<view class="flex-column flex flex-center grid-gap-12">
						<view class="box-bg gradient flex flex-center fs-18"> 完成50%</view>
						<view class="w-13 h-13 round-circle " :class="getRatio>=50?'bg-green':'bg-grey-5'"
							style="z-index: 99;"></view>
					</view>
					<view class="flex-column flex flex-center grid-gap-12">
						<view class="box-bg gradient flex flex-center fs-18"> 获得一次</view>
						<view class="w-13 h-13 round-circle bg-grey-5" style="z-index: 99;"></view>
					</view>
					<view class="absolute bottom-3 left-0 right-0 round-30  h-7">
						<progress stroke-width="7" border-radius="30" :percent='getRatio' activeColor="#426EFC"
							backgroundColor="#EDEDED"></progress>
					</view>
				</view>

				<view class="flex-1 round-8 gradient-s text-green text-center py-15 fs-16 fw-600" @click="show()">
					观看视频
				</view>

				<view class=" round-8  text-black text-center py-15 fs-16 fw-600 mt-12"
					style="background-color: #EDEDED;" @click="adPopup.close();popup.open()">
					开通会员
				</view>
			</view>
			<view @click="adPopup.close()"
				class=" w-30 h-30 text-grey-1 round-circle flex flex-center absolute right-10 top-18"
				style="background: rgba(116,116,128,0.08);;">
				<text class="iconfont icon-guanbi text-333 fs-14 fw-600"></text>
			</view>
		</y-popup>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, computed } from 'vue';
	import { onShow, onLoad, onPageScroll } from '@dcloudio/uni-app'
	import ySetup from './modules/y-setup.vue'
	import yTitle from './modules/y-title.vue'
	import { $page, $http, $tool } from '@/utils'
	import { useRefs, useUserStore, useWebConfigStore } from '@/stores'
	import { useStorage } from '@/utils/storeage.js'
	import { useInterstitialAd } from '@/composables/useInterstitialAd.js';
	import { initRewardedVideoAd } from '@/composables/ad.js'
	const { init, show } = initRewardedVideoAd();
	// const { init as interInit, show as interShow } = initInterstitialAd()
	const safeBottom = ref(20)
	const initBottom = async () => {
		const system = await uni.getSystemInfoSync()
		const bottomInset = system.screenHeight - system.safeArea.bottom
		if (bottomInset > 0) {
			safeBottom.value = bottomInset
		}
	}

	const { USERINFO } = useRefs(useUserStore())
	const { WEBCONFIG } = useRefs(useWebConfigStore())
	const { hasLogin, setUserInfo, getUserInfo, setToken } = useUserStore()
	const ratioList = [
		{ label: '9:16（竖屏）', value: '9:16' },
		{ label: '16:9（横屏）', value: '16:9' },
	];
	const durationList = [
		{ label: '10秒', value: 10 },
		{ label: '15秒', value: 15 },
		{ label: '25秒', value: 25, disable: true },
	];

	const onChangeTime = (e) => {
		if (e.disable) {
			return $tool.toast('敬请期待')
		};
		form.value.duration = e.value
	}
	const adPopup = ref(null)
	const form = ref({
		type: 1,
		aspectRatio: '9:16',
		prompt: '',
		image_url: '',
		product_name: '',
		duration: 10
	})
	onLoad((e) => {
		getPrompt()
		if (e.data) {
			const data = JSON.parse(e.data);
			form.value.prompt = data.prompt
			form.value.image_url = data.image_url
			form.value.type = data.type
			form.value.product_name = data.product_name
			form.value.aspectRatio = data.aspectRatio
		}
		uni.$once('initConfig', () => {
			// #ifdef MP-WEIXIN
			if (WEBCONFIG?.value?.wx_ad_status.includes('wx_interstitial')) {
				const { initAd } = useInterstitialAd(WEBCONFIG?.value.wx_interstitial_time)
				initAd(WEBCONFIG?.value.wx_interstitial);
			}
			if (WEBCONFIG?.value.wx_ad_status.includes('wx_rewarded')) {
				init(WEBCONFIG?.value.wx_rewarded, (e) => {
					if (e == 'reward') {
						$http.post('User/addAdNumber').then(res => {
							getUserInfo();
						})
					} else {
						$tool.toast('未观看完成,无法获得奖励');
					}
				});
			}
			// #endif
		})

		uni.$on('meaterial', (e) => {
			form.value.image_url = e
		})

	})


	onShow(() => {
		if (hasLogin()) {
			getUserInfo();
		} else {
			login()
		}
	})

	const promptList = ref([])
	const getPrompt = () => {
		$http.get('Prompt/getList').then(res => {
			promptList.value = res.data
		})
	}

	const uploadImage = async () => {
		try {
			const tmpFiles = await uni.chooseImage({
				count: 1,
			})
			const result = await $http.upload('Upload/upload', {
				filePath: tmpFiles.tempFilePaths[0],
				name: 'file',
				is_hide: 1
			});
			form.value.image_url = result.data.url
			await $http.post('Material/add', { url: result.data.url });
			$tool.toast('上传成功');
		} catch (error) {
			console.log(error)
			$tool.toast('上传失败');
		}
	}

	const getRatio = computed(() => {
		const a = USERINFO?.value.ad_number ? USERINFO?.value.ad_number : 0
		const b = WEBCONFIG?.value?.ad_number ? WEBCONFIG?.value?.ad_number : 0
		if (b == 0 || a == 0) {
			return 0;
		}
		const number = USERINFO?.value.ad_number / WEBCONFIG?.value?.ad_number
		return Math.floor(number * 100)
	})

	const handGenVideo = async () => {
		if (USERINFO?.value.productions < 1) {
			return adPopup.value.open();
		}
		uni.showLoading({
			title: '任务创建中...',
			mask: true
		})
		await $http.post('Generate/generateSora', form.value);
		$tool.toast('任务创建成功');
		setTimeout(() => {
			$page.open('/pages/works/index');
		}, 300)
	}


	const toM = () => {
		$page.open('/pages/material/index');
	}

	const login = () => {
		let data = {
			pid: 0,
			code: '',
		};
		const pid = useStorage().get('PID')
		data.pid = pid || 0
		uni.showLoading({
			title: '登录中...'
		})
		uni.login({
			provider: 'weixin',
			success(res) {
				data.code = res.code
				$http.post('User/login', data).then(res => {
					$tool.toast('登录成功', 'success');
					setToken(res.data.token, res.data.ttl)
					setUserInfo(res.data.user)
				})
			}
		})
	}
	const setPrompt = () => {
		if (promptList.value.length < 1) return;
		const index = getRandomInt(0, promptList.value.length)
		const prompt = promptList.value[index].prompt;
		form.value.prompt = prompt
	}
	const getRandomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	onMounted(() => {
		initBottom()
	})
</script>

<style>
	.avatar {
		width: 72rpx;
		height: 72rpx;
	}

	.disable {
		background-color: #4b4b4e !important;
		color: #999;
	}

	.pb-50 {
		padding-bottom: 50px;
	}

	.box-bg {
		width: 112px;
		height: 74px;
		border-radius: 24rpx;
		position: relative;
	}

	.box-bg::after {
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -8px;
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid #426EFC;
	}

	.box-bg::before {
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -9px;
		width: 0;
		height: 0;
		border-left: 9px solid transparent;
		border-right: 9px solid transparent;
		border-top: 9px solid #426EFC;
	}
</style>