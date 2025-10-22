const buildOptions = (params) => {
	if (typeof params === 'string') {
		return { url: params };
	}
	return { ...params };
};

const getPageRoute = () => {
	const pages = getCurrentPages();
	const route = pages[pages.length - 1]?.route || '';
	return `/${route}`;
};

export const $page = {
	open: (params) => {
		const options = buildOptions(params);
		if (options.url === getPageRoute()) return;
		uni.navigateTo(options);
	},
	redirect: (params) => {
		const options = buildOptions(params);
		if (options.url === getPageRoute()) return;
		uni.redirectTo(options);
	},
	reLaunch: (params) => {
		const options = buildOptions(params);
		if (options.url === getPageRoute()) return;
		uni.reLaunch(options);
	},
	switch: (params) => {
		const options = buildOptions(params);
		if (options.url === getPageRoute()) return;
		uni.switchTab(options);
	},
	back: () => {
		const pages = getCurrentPages();
		if (pages.length === 1) {
			uni.redirectTo({ url: '/pages/index/index' });
		} else {
			uni.navigateBack();
		}
	},
};