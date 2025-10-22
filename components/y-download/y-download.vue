<template>
	<y-popup ref='progressPopup' round='8' backgroundColor="#fff">
		<view class="text-center fs-18 fw-bold pt-20 ">
			文件下载
		</view>
		<view class="flex p-20 flex-y-center grid-gap-8 w-280">
			<progress :percent='progress' activeColor="#4cd964" class='w-p-100' show-info border-radius='10'></progress>
		</view>
		<view class="px-20 pb-20 ">
			<button @click="cancel()" class="gradient  fs-14 w-p-100 py-4">取消下载</button>
		</view>
	</y-popup>
</template>

<script setup>
	import { ref } from 'vue'
	const progressPopup = ref()
	const progress = ref(0)
	const DownloadTask = ref()
	const downloadUrl = ref()
	const downloadStart = (e) => {
		downloadUrl.value = e
		download()
	}

	const download = () => {
		// #ifdef H5
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) === "micromessenger") {
			uni.setClipboardData({
				data: downloadUrl.value,
				success(res) {
					uni.showModal({
						title: '复制成功',
						content: '链接已复制,请在外部浏览器打开下载'
					})
				}
			})
			return;
		}

		DownloadTask.value = uni.downloadFile({
			url: downloadUrl.value,
			success: (res) => {
				uni.hideLoading()
				let file_name = generateRandomString(20)
				let file_type = downloadUrl.value.split('.').pop()
				var oA = document.createElement("a")
				oA.download = `${file_name}.${file_type}`
				oA.href = res.tempFilePath
				document.body.appendChild(oA)
				oA.click()
				oA.remove()
				progressPopup.value.close()
			}
		})
		// #endif

		// #ifdef MP-WEIXIN
		DownloadTask.value = uni.downloadFile({
			url: downloadUrl.value,
			success: (res) => {
				uni.hideLoading();
				uni.saveVideoToPhotosAlbum({
					filePath: res.tempFilePath,
					success: () => {
						progressPopup.value.close()
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
					},
					fail: (err) => {
						progressPopup.value.close()
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						})
						return;
					}
				})
			},
			fail: () => {
				progressPopup.value.close()
				uni.hideLoading();
				uni.showToast({
					title: '下载失败',
					icon: 'none'
				})
				return;
			},
		})
		// #endif

		progressPopup.value.open()
		DownloadTask.value.onProgressUpdate((res) => {
			progress.value = res.progress
		})
	}

	const cancel = () => {
		uni.showModal({
			title: '取消下载',
			content: "是否确认取消？",
			success(res) {
				if (res.confirm) {
					DownloadTask.value.abort()
					progressPopup.value.close()
				}
			}
		})
	}

	defineExpose({ downloadStart })
</script>

<style>
</style>