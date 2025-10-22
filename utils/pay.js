export const pay = (type, data) => {
	return new Promise((resolve, reject) => {
		if (type == 'applet' || type == 'official') {
			// #ifdef MP-WEIXIN
			uni.requestPayment({
				"appId": data.appId,
				"timeStamp": data.timeStamp,
				"nonceStr": data.nonceStr,
				"package": data.package,
				"signType": "MD5",
				"paySign": data.paySign,
				success(res) {
					resolve(res)
				},
				fail(error) {
					reject(error)
				}
			})
			// #endif

			// #ifdef H5
			WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId": data.appId,
				"timeStamp": data.timeStamp,
				"nonceStr": data.nonceStr,
				"package": data.package,
				"signType": "MD5",
				"paySign": data.paySign
			}, function(result) {
				if (result.err_msg == "get_brand_wcpay_request:ok") {
					resolve(result)
				} else {
					reject()
				}
			})
			// #endif
		}
	})
}