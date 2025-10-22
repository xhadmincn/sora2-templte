<template>
	<view class="nav sticky top-0"
		:style="`--status-bar-height:${height}px;--nav-opacity:${navOpacity};--right:${right}px`">
		<slot></slot>
	</view>
</template>

<script setup>
	import { onPageScroll } from '@dcloudio/uni-app'
	import { ref, computed, onMounted } from 'vue';
	// #ifdef MP-WEIXIN
	const height = uni.getWindowInfo().statusBarHeight
	// #endif
	
	// #ifdef H5
	const height =10
	// #endif
	
	const right = ref(0)
	onMounted(() => {
		// #ifdef MP-WEIXIN
		right.value = uni.getWindowInfo().screenWidth - uni.getMenuButtonBoundingClientRect().left
		// #endif
	})
	const scrollHeight = ref(0);
	const navOpacity = computed(() => {
		if (scrollHeight.value > 0) {
			return scrollHeight.value > 100 ? 1 : scrollHeight.value / 100;
		}
		return 0;
	})
	onPageScroll(({ scrollTop }) => {
		scrollHeight.value = scrollTop;
	})
</script>

<style lang="scss">
	.nav {
		width: 100vw;
		height: calc(var(--status-bar-height) + 44px);
		padding-top: var(--status-bar-height);
		background-color: rgba(23, 22, 48, var(--nav-opacity));
		z-index: 99;
		padding-right: var(--right);
		display: flex;
		align-items: center;

		.w-187 {
			width: 374rpx;
		}
	}
</style>