import { useUserStore } from "@/stores"
import { useStorage } from '@/utils/storeage';
import system from './system.js';
import { $page } from "@/utils";


const apiUrl = system.domain + '/app/ycSora/api/'

const buildHeaders = (options = {}) => {
	const { hasLogin, getToken, initUserInfo } = useUserStore();
	const headers = {
		'Accept': 'application/json, text/plain, */*',
		...options.header,
	};
	if (hasLogin()) {
		headers['Authorization'] = getToken();
	}
	headers['Appid'] = system.appid()
	return headers;
};


const request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			header: buildHeaders(options),
			success: (res) => {
				const { data } = res;
				if (data.code === 200) {
					uni.hideLoading()
					resolve(data);
				} else {
					if (data.code == 12000) {
						const { clearToken, clearUserInfo } = useUserStore()
						clearToken()
						clearUserInfo()
						return $page.reLaunch('/pages/index/index')
					}
					uni.showModal({
						title: '失败',
						content: data.msg,
					})
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => uni.hideLoading(),
		});
	});
};

export const $http = {
	apiUrl,
	get: (url, data = {}, options = {}) => {
		options = {
			...options,
			url: `${apiUrl}${url}`,
			data,
			method: 'GET',
		};
		return request(options);
	},

	post: (url, data = {}, options = {}) => {
		options = {
			...options,
			url: `${apiUrl}${url}`,
			data,
			method: 'POST',
		};
		return request(options);
	},

	custom: (url, method, data = {}, options = {}) => {
		options = {
			...options,
			url: `${apiUrl}${url}`,
			data,
			method,
		};
		return request(options);
	},

	upload: (url, options = {}) => {
		if (!options.formData) {
			options.formData = {}
		}
		options.timeout = 300000
		options.formData.is_hide = 1
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				...options,
				header: buildHeaders(options),
				url: `${apiUrl}${url}`,
				success: (res) => {
					let { data } = res;
					if (typeof data === 'string') {
						data = JSON.parse(data)
					}
					if (data.code === 200) {
						resolve(data);
					} else {
						reject(res);
					}
				},
				fail: (err) => reject(err),
			});
		});
	},
};