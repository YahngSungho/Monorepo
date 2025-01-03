import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from 'tailwindcss'
a

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	plugins: [svelte(), tsconfigPaths()],
})
