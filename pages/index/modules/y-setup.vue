<template>
	<div class="bg-black-1 py-4 px-6 round-30 fs-18 grid-columns-2 text-center">
		<view v-for="(item, index) in list" :key="item.value" class="round-30 grid-column-1 py-6 transition-item"
			:class="modelValue === item.value ? 'active text-white' : 'text-grey'" @click="onChange(item)">
			{{ item.label }}
		</view>
	</div>
</template>

<script setup>
	const props = defineProps({
		modelValue: {
			default: 1,
			type: Number,
		},
	});

	const list = [
		{ label: '常规视频', value: 1 },
		{ label: '创意广告', value: 2 },
	];

	const emit = defineEmits(['update:modelValue']);
	const onChange = (item) => {
		emit('update:modelValue', item.value);
	};
</script>

<style scoped>
	.transition-item {
		transition: all 0.3s ease;
		/* 平滑过渡效果 */
	}

	.active {
		background: linear-gradient(90deg, #5D33FE 0%, #0FDDF6 100%);
		font-weight: 600;
		transform: scale(1.05);
		/* 略微放大 */
		box-shadow: 0 0 10px rgba(93, 51, 254, 0.5);
	}

	.text-grey {
		color: #aaa;
	}
</style>