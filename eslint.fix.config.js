import defaultConfig from './eslint.config.js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import perfectionist from 'eslint-plugin-perfectionist'

const overrideConfig = [
	{
		rules: {
			'svelte/html-closing-bracket-new-line': 'warn',
			'svelte/html-closing-bracket-spacing': 'warn',
			'svelte/html-quotes': [
				'warn',
				{
					dynamic: {
						avoidInvalidUnquotedInHTML: false,
						quoted: false,
					},
					prefer: 'double',
				},
			],
			'svelte/html-self-closing': [
				'warn',
				'default', // or "all" or "html" or "none"
			],
			'svelte/no-trailing-spaces': 'warn',
			'svelte/prefer-class-directive': 'warn',
			'svelte/no-useless-mustaches': 'warn',
			'svelte/shorthand-attribute': 'warn',
	'svelte/shorthand-directive': 'warn',
	'svelte/sort-attributes': 'warn',
	'svelte/spaced-html-comment': 'warn',
	'svelte/require-store-reactive-access': 'warn',
		}
	},
	perfectionist.configs['recommended-natural'],
	{
		rules: {
			'perfectionist/sort-exports': 'off',
'perfectionist/sort-imports': 'off',
'perfectionist/sort-modules': 'off',
'perfectionist/sort-named-exports': 'off',
'perfectionist/sort-named-imports': 'off',
'perfectionist/sort-objects': [
	'warn',
	{
		partitionByComment: true,
		partitionByNewLine: true,
	},
],
		}
	},
{
	plugins: {
		'simple-import-sort': simpleImportSort,
	},
	rules: {
		'simple-import-sort/exports': 'warn',
		'simple-import-sort/imports': 'warn',
	},
}
]

export default [...defaultConfig, ...overrideConfig]