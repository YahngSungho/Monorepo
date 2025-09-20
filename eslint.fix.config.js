import perfectionist from 'eslint-plugin-perfectionist'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import defaultConfig from './eslint.config.js'

const overrideConfig = [
	{
		rules: {
			'functional/readonly-type': 'warn',
			'svelte/first-attribute-linebreak': 'warn',
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
			'svelte/indent': [
				'warn',
				{
					ignoredNodes: ['style'],
					indent: 'tab',
					indentScript: false,
					switchCase: 1,
				},
			],
			'svelte/mustache-spacing': 'warn',
			'svelte/no-spaces-around-equal-signs-in-attribute': 'warn',
			'svelte/no-trailing-spaces': 'warn',
			'svelte/no-useless-mustaches': 'warn',
			'svelte/prefer-class-directive': [
				'warn',
				{
					prefer: 'always',
				},
			],
			'svelte/prefer-style-directive': 'warn',
			'svelte/require-store-reactive-access': 'warn',
			'svelte/shorthand-attribute': 'warn',
			'svelte/shorthand-directive': 'warn',
			'svelte/sort-attributes': 'warn',
			'svelte/spaced-html-comment': 'warn',
			'unicorn/prefer-set-has': 'warn',
		},
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/exports': 'warn',
			'simple-import-sort/imports': 'warn',
		},
	},
	perfectionist.configs['recommended-natural'],
	{
		rules: {
			'perfectionist/sort-exports': 'off',
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-named-exports': 'warn',
			'perfectionist/sort-named-imports': 'warn',

			'perfectionist/sort-classes': [
				'warn',
				{
					partitionByComment: true,
				},
			],
			'perfectionist/sort-modules': [
				'warn',
				{
					partitionByComment: true,
				},
			],
			'perfectionist/sort-objects': [
				'warn',
				{
					partitionByComment: true,
					partitionByNewLine: true,
				},
			],
			'perfectionist/sort-variable-declarations': [
				'warn',
				{
					partitionByComment: true,
					partitionByNewLine: true,
				},
			],
		},
	},
]

export default [...defaultConfig, ...overrideConfig]
