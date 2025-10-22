<template>
	<view class="index-bg text-white 100vh ">
		<y-nav>
			<view class="px-16">
				<text class="iconfont icon-fanhui" @click="$page.back()"></text>
			</view>
		</y-nav>
		<view class="p-12 pb-safe-area">
			
			<view class="flex flex-y-center gap-6" @click="user.open()">
				<image class="w-50 h-50 round-circle" :src="USERINFO?.avatar?USERINFO?.avatar:WEBCONFIG?.web_logo">
				</image>
				<view class="flex flex-column gap-4">
					<text class="fs-19">{{USERINFO?.nickname?USERINFO?.nickname:"请先登录~"}}</text>
					<text class="fs-12">id：{{USERINFO?.id?USERINFO?.id:'-'}}</text>
				</view>
			</view>
			<view class="mt-22 bg-black-1 round-12 overflow-hidden">
				<view :style="`background-image: url('${system.domain}/app/ycSora/image/hy.png');`"
					class="hy px-15 flex flex-column py-12 text-brown gap-8">
					<text class="fs-20 fw-bold">VIP会员</text>
					<text>开通享受创作视频专属特权</text>
				</view>
				<view class="py-9 grid-columns-3">
					<view class="flex flex-column gap-4 flex-center" @click="$page.open('/pages/works/index')">
						<text class="fs-18">{{total}}</text>
						<text class="fs-14 text-999">我的作品</text>
					</view>
					<view class="flex flex-column gap-4 flex-center">
						<text class="fs-18">{{USERINFO?.productions}}</text>
						<text class="fs-14 text-999">创作次数</text>
					</view>
					<view class="flex flex-column gap-4 flex-center">
						<text class="fs-18">{{USERINFO?.code_number}}</text>
						<text class="fs-14 text-999">会员邀请码</text>
					</view>
				</view>
			</view>
			<view class="mt-20">
				<view class="fs-15">快捷操作</view>
				<view class="bg-black-1 round-12 py-8 px-10 mt-8">
					<view class="flex flex-y-center py-16 gap-6" v-for="(item,index) in tab" :key="index"
						@click="handClickTab(item)">
						<image :src="item.image" class="w-20 h-20"></image>
						<view class="flex-1 fs-16">{{item.name}}</view>
						<text class="iconfont icon-fanhui1"></text>
					</view>
				</view>
			</view>
			<view class="mt-20">
				<view class="fs-15">帮助中心</view>
				<view class="bg-black-1 round-12 py-8 px-10 mt-8">
					<view class="flex flex-y-center py-16 gap-6" v-for="(item,index) in tab1" :key="index"
						@click="handClickTab(item)">
						<image :src="item.image" class="w-20 h-20"></image>
						<view class="flex-1 fs-16">{{item.name}}</view>
						<text class="iconfont icon-fanhui1"></text>
					</view>
				</view>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="mt-20 " v-if="WEBCONFIG?.wx_ad_status.includes('wx_video')">
				<ad :unit-id="WEBCONFIG?.wx_video" ad-theme="white">
				</ad>
			</view>
			<!-- #endif -->
			
			<view class="mt-20 text-center py-14 fs-18 round-8 bg-black-1" v-if="hasLogin()" @click="outLogin">退出登录
			</view>
		</view>

		<y-popup mode="bottom" backgroundColor="#fff" round="12" ref="cdkeyPopup">
			<view class="p-18 text-black ">
				<view class="text-center fs-20 fw-600 ">卡密兑换</view>
				<view class="  round-12 mt-20 px-12 py-16" style="background-color: #F2F3F5;">
					<input placeholder="请输入您的卡密兑换码" v-model="code" />
				</view>
				<view class="mt-20 gradient text-white text-center round-12 py-14" @click="cdkey">
					确认兑换
				</view>
			</view>
			<view @click="cdkeyPopup.close()"
				class=" w-30 h-30 text-grey-1 round-circle flex flex-center absolute right-10 top-18"
				style="background: rgba(116,116,128,0.08);;">
				<text class="iconfont icon-guanbi text-333 fs-14 fw-600"></text>
			</view>
		</y-popup>


		<y-popup ref="popupCustomer" mode="bottom" round="12px">
			<view class="p-20 text-center flex flex-column flex-y-center gap-12">
				<text class="fs-18 fw-600 text-black">客服二维码</text>
				<view class="border-blue p-8 round-8" style="border-style: dotted;">
					<image :src="WEBCONFIG?.customer_qrcode" class="vh-40" mode="heightFix" show-menu-by-longpress>
					</image>
				</view>
				<text class="fs-12 text-grey-1">长按保存二维码到本地</text>
			</view>
			<view @click="popupCustomer.close()"
				class=" w-30 h-30 text-grey-1 round-circle flex flex-center absolute right-10 top-18"
				style="background: rgba(116,116,128,0.08);;">
				<text class="iconfont icon-guanbi text-333 fs-14 fw-600"></text>
			</view>
		</y-popup>
		<y-user ref="user"></y-user>
	</view>
</template>

<script setup>
	import { $http, $page, $tool } from '@/utils';
	import { useRefs, useUserStore, useWebConfigStore } from '@/stores'
	import { ref, onMounted } from 'vue';
	import { onShow, onLoad, onPageScroll } from '@dcloudio/uni-app'
	import system from '@/utils/system';
	import { useInterstitialAd } from '@/composables/useInterstitialAd.js';
	
	
	const { USERINFO } = useRefs(useUserStore())
	const { WEBCONFIG } = useRefs(useWebConfigStore())
	const { getUserInfo, hasLogin, clearUserInfo } = useUserStore();
	const user = ref(null)
	const tab = [
		{ name: "我的作品", value: 1, image: '/static/image/wdzp.png' },
		{ name: "卡密兑换", value: 2, image: '/static/image/kmdh.png' },
		{ name: "历史素材", value: 3, image: '/static/image/lssc.png' },
	];
	const tab1 = [
		{ name: "联系客服", value: 4, image: '/static/image/akf.png' },
		{ name: "关于我们", value: 5, image: '/static/image/gywm.png' },
		{ name: "使用文档", value: 6, image: '/static/image/sywd.png' },
	];
	const cdkeyPopup = ref(null)
	const popupCustomer = ref(null)
	const code = ref('')

	const handClickTab = (e) => {
		switch (e.value) {
			case 1:
				$page.open('/pages/works/index');
				break;
			case 2:
				cdkeyPopup.value.open();
				break;
			case 3:
				$page.open('/pages/material/index');
				break;
			case 4:
				openCustomer()
				break;
			case 5:
				$page.open('/pages/article/index?name=about');
				break;
			case 6:
				$page.open('/pages/article/index?name=use');
				break;
		}
	}
	const cdkey = () => {
		uni.showLoading({
			title: '兑换中...'
		})
		$http.post('Cdkey/cdkey', { code: code.value }).then(res => {
			$tool.toast('兑换成功');
			cdkeyPopup.value.close();
			getUserInfo()
		})
	}

	const outLogin = () => {
		clearUserInfo()
		$tool.toast('退出登录成功');
		setTimeout(() => {
			$page.reLaunch('/pages/index/index');
		})
	}


	const openCustomer = () => {
		// #ifdef H5
		popupCustomer.value.open()
		// #endif
		// #ifdef MP-WEIXIN
		if (WEBCONFIG.value.customer_type == '3') {
			popupCustomer.value.open()
		} else {
			wx.openCustomerServiceChat({
				extInfo: {
					url: WEBCONFIG.value.customer_url
				},
				corpId: WEBCONFIG.value.customer_corpId,
				success(res) {
					console.log(res, 1)
				},
				fail(res) {
					console.log(res, 2)
				},
			})
		}
		// #endif
	}
	const total = ref(0)
	const getCount = () => {
		$http.get('User/getDataCount').then(res => {
			total.value = res.data.total
		})
	}
	onShow(() => {
		getCount();
		getUserInfo()
	})
	onLoad(()=>{
		const { initAd } = useInterstitialAd(WEBCONFIG?.value.wx_interstitial_time)
		initAd(WEBCONFIG?.value.wx_interstitial);
	})
</script>

<style>
	.hy {
		width: 100%;
		height: 85px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>