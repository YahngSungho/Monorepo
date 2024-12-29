import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	plugins: [sveltekit()],
});
