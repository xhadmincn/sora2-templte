import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useRefs, useWebConfigStore, useUserStore } from '@/stores'

export const share = ({ title, imageUrl, path } = {}) => {
	const { WEBCONFIG } = useRefs(useWebConfigStore())
	const shareTitle = title || WEBCONFIG?.value?.share_title || WEBCONFIG?.value?.web_name
	const shareImage = imageUrl || WEBCONFIG?.value?.share_image || WEBCONFIG?.value?.web_logo
	const sharePath = path || getCurrentPageUrlWithArgs()
	return {
		title: shareTitle,
		path: sharePath,
		query: sharePath,
		imageUrl: shareImage
	}
}

function getCurrentPageUrlWithArgs() {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const route = currentPage.route
	const options = currentPage.options || {}
	let urlWithArgs = '/pages/index/index'
	// 构建查询参数
	const query = { ...options }

	const { USERINFO } = useRefs(useUserStore())
	if (USERINFO?.value?.id) {
		query.user_id = USERINFO.value.id
	}
	const queryStr = Object.keys(query)
		.map(key => `${key}=${encodeURIComponent(query[key])}`)
		.join('&')

	if (queryStr) {
		urlWithArgs += '?' + queryStr
	}
	return urlWithArgs
}
export default {
	onShareAppMessage: share,
	onShareTimeline: share
}