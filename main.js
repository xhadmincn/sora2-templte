import App from './App'
import { createPinia } from 'pinia'
import useShare from '@/composables/useShare'
const pinia = createPinia()

import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(pinia)
	app.mixin(useShare)
	return {
		app
	}
}