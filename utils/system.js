import { useStorage } from '@/utils/storeage';

import { siteinfo } from "@/siteinfo";

const host = () => {
	// #ifndef H5
	return siteinfo.siteroot;
	// #endif


	// #ifdef H5
	let baseURL = 'https://xcyd.kf.kaifa.cc';
	if (process.env.NODE_ENV !== 'development') {
		baseURL = globalThis.location.origin;
		if (baseURL.endsWith("//")) {
			baseURL = baseURL.replace(/\/\/$/, "/");
		}
	}
	return baseURL;
	// #endif

};

const appid = () => {
	// #ifndef H5
	return siteinfo.app_id;
	// #endif
	// #ifdef H5
	return useStorage().get('APPID');
	// #endif
};

const domain = host();
const developmentUrl = `${host()}/app/ycSora/api/`;

const productionUrl = `${host()}/app/ycSora/api/`;

const baseUrl = process.env.NODE_ENV === 'development' ? developmentUrl : productionUrl;


export default {
	baseUrl,
	appid, 
	domain
};