export default {
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'all',
	semi: false,
	printWidth: 100,
	plugins: [
		'prettier-plugin-jsdoc',
		'prettier-plugin-sort-json',
		'prettier-plugin-package-perfection',
		'prettier-plugin-classnames',
		'prettier-plugin-svelte',
		'prettier-plugin-sql',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-merge', // MUST come last
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
