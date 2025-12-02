import perfectionist from 'eslint-plugin-perfectionist'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import defaultConfig from './eslint.config.js'

const overrideConfig = [
	{
		rules: {
			'no-regex-spaces': 'warn',
			'no-extra-boolean-cast': 'warn',
			'array-func/avoid-reverse': 'warn',
			'array-func/from-map': 'warn',
			'array-func/prefer-array-from': 'warn',
			'array-func/prefer-flat': 'warn',
			'array-func/prefer-flat-map': 'warn',
			'functional/readonly-type': 'warn',
			'one-var': 'warn',
			'prefer-template': 'warn',
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
			'svelte/shorthand-attribute': [
				'warn',
				{
					prefer: 'never',
				},
			],
			'svelte/shorthand-directive': [
				'warn',
				{
					prefer: 'never',
				},
			],
			'svelte/sort-attributes': 'warn',
			'svelte/spaced-html-comment': 'warn',
			'unicorn/catch-error-name': 'warn',
			'unicorn/consistent-assert': 'warn',
			'unicorn/consistent-date-clone': 'warn',
			'unicorn/consistent-destructuring': 'warn',
			'unicorn/consistent-empty-array-spread': 'warn',
			'unicorn/consistent-existence-index-check': 'warn',
			'unicorn/custom-error-definition': 'warn',
			'unicorn/empty-brace-spaces': 'warn',
			'unicorn/escape-case': 'warn',
			'unicorn/explicit-length-check': 'warn',
			'unicorn/no-array-for-each': 'warn',
			'unicorn/no-array-push-push': 'warn',
			'unicorn/no-console-spaces': 'warn',
			'unicorn/no-for-loop': 'warn',
			'unicorn/no-hex-escape': 'warn',
			'unicorn/no-instanceof-builtins': 'warn',
			'unicorn/no-nested-ternary': 'warn',
			'unicorn/no-new-array': 'warn',
			'unicorn/no-new-buffer': 'warn',
			'unicorn/no-static-only-class': 'warn',
			'unicorn/no-unreadable-array-destructuring': 'warn',
			'unicorn/no-useless-fallback-in-spread': 'warn',
			'unicorn/no-useless-length-check': 'warn',
			'unicorn/no-useless-promise-resolve-reject': 'warn',
			'unicorn/no-useless-spread': 'warn',
			'unicorn/number-literal-case': 'warn',
			'unicorn/numeric-separators-style': 'warn',
			'unicorn/prefer-array-find': 'warn',
			'unicorn/prefer-array-flat': 'warn',
			'unicorn/prefer-array-flat-map': 'warn',
			'unicorn/prefer-array-index-of': 'warn',
			'unicorn/prefer-array-some': 'warn',
			'unicorn/prefer-at': 'warn',
			'unicorn/prefer-date-now': 'warn',
			'unicorn/prefer-dom-node-append': 'warn',
			'unicorn/prefer-dom-node-dataset': 'warn',
			'unicorn/prefer-dom-node-remove': 'warn',
			'unicorn/prefer-global-this': 'warn',
			'unicorn/prefer-includes': 'warn',
			'unicorn/prefer-keyboard-event-key': 'warn',
			'unicorn/prefer-math-min-max': 'warn',
			'unicorn/prefer-math-trunc': 'warn',
			'unicorn/prefer-modern-dom-apis': 'warn',
			'unicorn/prefer-modern-math-apis': 'warn',
			'unicorn/prefer-native-coercion-functions': 'warn',
			'unicorn/prefer-node-protocol': 'warn',
			'unicorn/prefer-number-properties': 'warn',
			'unicorn/prefer-object-from-entries': 'warn',
			'unicorn/prefer-optional-catch-binding': 'warn',
			'unicorn/prefer-prototype-methods': 'warn',
			'unicorn/prefer-query-selector': 'warn',
			'unicorn/prefer-reflect-apply': 'warn',
			'unicorn/prefer-regexp-test': 'warn',
			'unicorn/prefer-set-has': 'warn',
			'unicorn/prefer-set-size': 'warn',
			'unicorn/prefer-string-replace-all': 'warn',
			'unicorn/prefer-string-slice': 'warn',
			'unicorn/prefer-string-trim-start-end': 'warn',
			'unicorn/prefer-switch': 'warn',
			'unicorn/prefer-type-error': 'warn',
			'unicorn/prevent-abbreviations': [
				'warn',
				{
					replacements: {
						prop: false,
						props: false,
					},
				},
			],
			'unicorn/relative-url-style': 'warn',
			'unicorn/switch-case-braces': 'warn',
			'unicorn/text-encoding-identifier-case': 'warn',
			'unicorn/throw-new-error': 'warn',
		},
	},
	{
		files: ['**/*.md/*.*', '**/*.mdc/*.*', '**/*.mdx/*.*'],
		rules: {
			'unicorn/prevent-abbreviations': 'off',
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
					partitionByNewLine: true,
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
