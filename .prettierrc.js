export default {
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'all',
	semi: false,
	printWidth: 100,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
			},
		},
	],
}
