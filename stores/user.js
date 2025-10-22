import { ref } from 'vue';
import { useStorage } from '@/utils/storeage';
import { $http } from '../utils';

export default () => {
	const storage = useStorage();
	const USERINFO = ref(null);
	const TOKEN = ref(null)

	const getUserInfo = () => {
		$http.get('User/getUser').then(res => {
			setUserInfo(res.data)
		});
	}

	const setUserInfo = (user, expiresAt = 604800) => {
		USERINFO.value = user;
		storage.set('USERINFO', user, expiresAt);
	};

	const clearUserInfo = () => {
		USERINFO.value = null;
		storage.remove('USERINFO');
		TOKEN.value=null;
		storage.remove('TOKEN');
	};

	const initUserInfo = () => {
		const user = storage.get('USERINFO');
		if (user) {
			setUserInfo(user);
		}
	};

	const hasLogin = () => {
		const token = storage.get('TOKEN')
		return !!token;
	};

	const setToken = (token, expiresAt = 604800) => {
		TOKEN.value = token;
		storage.set('TOKEN', token, expiresAt);
	};

	const getToken = () => {
		const token = storage.get('TOKEN')
		return token;
	};

	return {
		TOKEN,
		setToken,
		USERINFO,
		setUserInfo,
		getToken,
		clearUserInfo,
		initUserInfo,
		hasLogin,
		getUserInfo
	};
};