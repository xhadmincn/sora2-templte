export const $tool = {
	toast: (msg = '', icon = 'none') => {
		uni.showToast({
			title: msg,
			icon: icon
		})
	},
	formatNumber: (number, decimalPlaces = 0) => {
		const num = Number(number);
		const isWhole = num === Math.floor(num);
		const hasFraction = !isWhole && String(num).includes('.');
		const places = hasFraction ? 2 : Number(decimalPlaces);
		return Number(num.toFixed(places));
	},
	formatSecondsToMinutes: (seconds) => {
		const totalSeconds = Number(seconds);
		if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
		const mins = Math.floor(totalSeconds / 60);
		const secs = Math.floor(totalSeconds % 60);
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	},
	replaceUrlParam:(key, value)=> {
	    const url = new URL(globalThis.location.href);
		const queryArr=url.hash.split('?');
		const hashParams = new URLSearchParams(queryArr[1]?queryArr[1]:''); 
	    hashParams.set(key, value);
	    url.hash = queryArr[0]+'?'+hashParams.toString();
	    globalThis.history.replaceState({}, '', url.href);
	}
}