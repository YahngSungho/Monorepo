import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default defineConfig({
	css: {
		devSourcemap: true,
	},
	// Fix: storybook 업데이트 하면서 svelte() 이거 sveltekit으로 바꾸고, base/vite.config.js 에서 import 한 거 사용하게 만들기
	plugins: [svelte(), tsconfigPaths(), tailwindcss()],
})
