import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	  resolve: {
		alias: {
			$shadcn: '../packages/ui/src/shadcn',
			'$shadcn/*': '../packages/ui/src/shadcn/*',
		},
	},
})
