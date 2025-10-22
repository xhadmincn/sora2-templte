<template>
	<view class="fixed bottom-0 left-0 right-0   bg-black-1" :style="`padding-bottom: ${safeBottom}px;z-index:999;`">
		<slot></slot>
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	const safeBottom = ref(20)
	const init = async () => {
		const system = await uni.getSystemInfoSync()
		const bottomInset = system.screenHeight - system.safeArea.bottom
		if (bottomInset > 0) {
			safeBottom.value = bottomInset
		}
	}
	onMounted(() => {
		init()
	})
</script>

<style>
</style>