export default {
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'all',
	semi: false,
	printWidth: 100,
	plugins: [
		        "prettier-plugin-svelte",
        "prettier-plugin-tailwindcss"
	],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
			},
		},
	],

}
