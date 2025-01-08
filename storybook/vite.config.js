import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import tailwindcss2 from '@tailwindcss/postcss'

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		devSourcemap: true,
		postcss: {
			plugins: [tailwindcss2()],
		},
	},
	plugins: [svelte(), tsconfigPaths(), tailwindcss()],
})
