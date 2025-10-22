<script setup>
	import { onLaunch } from '@dcloudio/uni-app'
	import {  useUserStore, useWebConfigStore } from '@/stores'
	import { $http, $tool, useStorage } from './utils'
	import system from './utils/system'
	const { initUserInfo, setToken } = useUserStore()
	const { setWebConfig } = useWebConfigStore()
	const { get, set } = useStorage()
	onLaunch((options) => {
		const appid = options.query?.appid || system.appid();
		if (appid) {
			useStorage().set('APPID', appid)
		}

		const pid = options.query?.user_id;
		if (pid && !get('PID')) {
			set('PID', pid);
		}

		const scene = options.query?.scene;
		if (scene) {
			const sceneArr = decodeURIComponent(scene).split('&');
			const sceneObj = {};
			sceneArr.forEach(item => {
				const arr = item.split('=');
				sceneObj[arr[0]] = arr[1];
			})
			if (sceneObj.user_id) {
				set('PID', sceneObj.user_id);
			}
		}
		const { setUserInfo } = useUserStore()
		let token = options.query?.token;
		if (token) {
			$tool.replaceUrlParam('token', '')
			setToken(token, 8640000)
		}

		initUserInfo()
		$http.get('Config/getConfig').then(res => {
			setWebConfig(res.data);
			uni.$emit('initConfig')
		});
	})
</script>

<style lang="scss">
	@import "static/y.scss";
	@import "static/iconfont.css";

	view {
		box-sizing: border-box;
	}

	page {
		background-color: #020120;
	}
	
	.btn-normal {
		display: block;
		margin: 0;
		padding: 0;
		line-height: normal;
		background: none;
		border-radius: 0;
		box-shadow: none;
		border: none;
		font-size: unset;
		text-align: unset;
		overflow: visible;
		color: inherit;
	}
	
	.btn-normal:after {
		border: none;
	}
	
	.btn-normal.button-hover {
		color: inherit;
	}
</style>