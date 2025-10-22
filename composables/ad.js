// 插屏广告
export const initInterstitialAd = () => {
	let interstitialAd = null;

	const init = (ad_id = '', fn = () => {}) => {
		if (!wx?.createInterstitialAd) {
			console.warn('当前平台不支持插屏广告');
			return;
		}
		if (interstitialAd) return;

		interstitialAd = wx.createInterstitialAd({ adUnitId: ad_id });

		interstitialAd.onLoad(() => {
			console.log('插屏广告加载成功');
			fn('success')
		});

		interstitialAd.onError((err) => {
			console.error('插屏广告加载失败', err);
			fn('error', err);
		});

		interstitialAd.onClose((res) => {
			fn('closed', res);
		});
	};

	const show = async (fallback = () => {}) => {
		try {
			if (!interstitialAd) {
				console.warn('插屏广告未初始化');
				fallback('not_initialized');
				return;
			}
			await interstitialAd.show()
		} catch (err) {
			fallback('err');
			console.log(err)
		}
	};

	return { init, show };
};



// 激励视频广告
export const initRewardedVideoAd = () => {
	let rewardedVideoAd = null;

	const init = (ad_id, fn = () => {}) => {
		if (!uni?.createRewardedVideoAd) {
			console.warn('当前平台不支持激励视频广告');
			return;
		}
		if (rewardedVideoAd) return;

		rewardedVideoAd = uni.createRewardedVideoAd({ adUnitId: ad_id });

		rewardedVideoAd.onLoad(() => {
			console.log('激励视频广告加载成功');
		});

		rewardedVideoAd.onError((err) => {
			console.error('激励视频广告加载失败', err);
			fn('error', err);
		});

		rewardedVideoAd.onClose((res) => {
			if (res && res.isEnded) {
				fn('reward');
			} else {
				fn('cancel');
			}
		});
	};

	const show = (fallback = () => {}) => {
		if (!rewardedVideoAd) {
			console.warn('激励视频广告未初始化');
			fallback('not_initialized');
			return;
		}
		rewardedVideoAd.show().catch(() => {
			rewardedVideoAd.load()
				.then(() => rewardedVideoAd.show())
				.catch(err => {
					console.error('激励视频广告展示失败', err);
					fallback(err);
				});
		});
	};

	return { init, show };
};