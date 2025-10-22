<template>
	<view class="popup" v-if='showPopup' :class="{'mask':props.mask}" @click="maskClose()"
		:style="`z-index:${props.zIndex + 98};`">
		<view :class="['box', props.mode||'center', on,props.mode=='bottom'?'pb-safe':'']" :style='getStyle()'
			@click.stop="">
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	const showPopup = ref(false)
	const emit = defineEmits(['maskClose'])
	const on = ref()
	const props = defineProps({
		mask: {
			default: true,
			type: Boolean
		},
		mode: {
			default: 'center',
			type: String
		},
		round: {
			default: '0rpx',
			type: [String, Number]
		},
		maskClickClose: {
			default: true,
			type: Boolean
		},
		backgroundColor: {
			default: '#fff',
			type: String
		},
		zIndex: {
			default: 0,
			type: [String, Number]
		}
	})
	const getStyle = () => {
		let round = typeof props.round == 'number' ? props.round + 'px' : props.round.endsWith('px') ? props.round :
			props.round + 'px'
		let str = `background:${props.backgroundColor};`;
		if (props.mode == 'center') {
			str += `border-radius: ${round};`
		}

		if (props.mode == 'top') {
			str += `border-bottom-left-radius:${round};border-bottom-right-radius:${round};`
		}

		if (props.mode == 'bottom') {
			str += `border-top-left-radius:${round};border-top-right-radius:${round};`
		}
		str += `z-index:${props.zIndex+99};`
		return str;
	}

	const open = () => {
		showPopup.value = true
		setTimeout(() => { animation(true) }, 20)
	}
	const close = () => {
		animation(false)
		setTimeout(() => {
			showPopup.value = false
		}, 330)
	}

	defineExpose({ open, close })
	const maskClose = () => {
		if (props.maskClickClose) {
			close()
			emit('maskClose')
		}
	}

	const animation = (n) => {
		switch (props.mode) {
			case 'bottom':
			case 'top':
				on.value = n ? 'on' : '';
				break;
			case 'center':
			default:
				on.value = n ? 'on-center' : ''
				break;
		}
	}
</script>

<style scoped>
	view {
		box-sizing: border-box;
	}

	.popup {
		position: fixed;
		inset: 0;
		z-index: 98;
	}

	.mask {
		background: rgba(0, 0, 0, 0.3);
	}

	.box {
		position: fixed;
		z-index: 99;
		inset: 0;
		overflow: hidden;
		transition: transform 0.33s ease-out;
		-webkit-transition: transform 0.33s ease-out;
		/* #ifdef H5 */
		/* bottom: var(--window-bottom) !important; */
		/* #endif */
	}

	.pb-safe {
		padding-bottom: constant(safe-area-inset-bottom) !important;
		padding-bottom: env(safe-area-inset-bottom) !important;
	}


	.top {
		inset: 0 0 auto 0;
		transform: translate3d(0, -100%, 0);
		-webkit-transform: translate3d(0, -100%, 0);
	}

	.center {
		inset: 50% auto auto 50%;
		transform: translate3d(-50%, -50%, 0) scale(0.5);
	}

	.bottom {
		inset: auto 0 0 0;
		transform: translate3d(0, 100%, 0);
		-webkit-transform: translate3d(0, 100%, 0);
	}

	.on {
		transform: translate3d(0, 0, 0);
		-webkit-transform: translate3d(0, 0, 0);
	}

	.on-center {
		transform: translate3d(-50%, -50%, 0) scale(1);
		-webkit-transform: translate3d(-50%, -50%, 0) scale(1);
		opacity: 1;
	}
</style>