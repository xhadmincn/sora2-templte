export function useStorage() {
	/**
	 * 设置存储数据（支持过期时间，单位：秒）
	 */
	const set = (key, data, expireSeconds = null) => {
		key = getKey(key)
		const record = {
			data,
			expiresAt: expireSeconds ? Date.now() + expireSeconds * 1000 : null
		}
		return uni.setStorageSync(key, record)
	}

	/**
	 * 获取数据（自动处理过期逻辑）
	 */
	const get = (key) => {
		key = getKey(key)
		const record = uni.getStorageSync(key)
		if (!record) return null

		if (record.expiresAt && Date.now() > record.expiresAt) {
			// 数据过期，自动清除
			remove(key)
			return null
		}

		return record.data
	}

	/**
	 * 删除数据
	 */
	const remove = (key) => {
		key = getKey(key)
		return uni.removeStorageSync(key)
	}

	/**
	 * 生成带前缀的存储键
	 */
	const getKey = (key) => {
		return 'KEY_BOT_' + key
	}

	return {
		set,
		get,
		remove
	}
}
