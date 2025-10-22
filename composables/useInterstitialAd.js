import { onUnmounted } from 'vue';
import { initInterstitialAd } from './ad.js'
import { onShow, onHide } from '@dcloudio/uni-app'
export function useInterstitialAd(defaultTime = 60) {
	const { init, show } = initInterstitialAd()
	let time = defaultTime;
	let timer = null;
	let hasStarted = false;
	let isLoading = false;
	let isFirst = true;
	const showAd = () => {
		show((e, res) => {
			if (e == 'err') {
				isLoading = false;
				if (res.errCode == 2001) {
					showAd()
				} else {
					countdown()
				}
			}
		})
	}
	const initAd = (ad_id) => {
		init(ad_id, (e, res) => {
			if (e == 'success') {
				isLoading = true
				if (isFirst) {
					isFirst = false;
					setTimeout(() => {
						showAd()
					}, 3000)
				}
			}
			if (e == 'closed') {
				isLoading = false;
				countdown()
			}
			if (e == 'error') {
				isLoading = false
			}
		});
	}
	const countdown = () => {
		if (hasStarted) return;
		hasStarted = true;
		timer = setInterval(() => {
			time--;
			if (time <= 0) {
				clearTimer();
				showAd();
			}
		}, 1000)
	}
	const clearTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
			time = defaultTime
		}
		hasStarted = false;
	};
	onUnmounted(clearTimer);
	onHide(clearTimer);
	onShow(() => {
		if (!isFirst) {
			countdown()
		}
	})
	return {
		initAd
	}
}