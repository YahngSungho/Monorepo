import depend from 'eslint-plugin-depend'
import turboConfig from 'eslint-config-turbo/flat'
import svelte from 'eslint-plugin-svelte'
import intlifyEslintPluginSvelte from '@intlify/eslint-plugin-svelte'
import perfectionist from 'eslint-plugin-perfectionist'
import storybook from 'eslint-plugin-storybook'
import sonarjs from 'eslint-plugin-sonarjs'
import xstate from 'eslint-plugin-xstate'
import regexp from 'eslint-plugin-regexp'
import parser_babel from '@babel/eslint-parser'
import parser_svelte from 'svelte-eslint-parser'
import parser_jsonc from 'jsonc-eslint-parser'
import parser_yaml from 'yaml-eslint-parser'
import parser_toml from 'toml-eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import eslintPluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native'
import pluginPromise from 'eslint-plugin-promise'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import nodePlugin from 'eslint-plugin-n'
import parser_TS from '@typescript-eslint/parser'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	allConfig: js.configs.all,
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
})

export default [
	includeIgnoreFile(gitignorePath),
	{
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: parser_babel,
			parserOptions: {
				ecmaVersion: 'latest',
				extraFileExtensions: ['.svelte'],
				requireConfigFile: false,
				sourceType: 'module',
			},
			sourceType: 'module',
		},

		plugins: {
			depend,
			intlifyEslintPluginSvelte,
			regexp,
			sonarjs,
			storybook,
			xstate,
		},

		settings: {
			svelte: {
				kit: {
					files: {
						routes: '**/src/routes',
					},
				},
			},
		},
	},

	js.configs.recommended,
	eslintPluginUnicorn.configs['flat/recommended'],
	importPlugin.flatConfigs.recommended,
	// ...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	...turboConfig,
	perfectionist.configs['recommended-natural'],
	nodePlugin.configs['flat/recommended-module'],
	eslintPluginNoUseExtendNative.configs.recommended,
	pluginPromise.configs['flat/recommended'],
	...compat.extends(
		'plugin:depend/recommended',
		'plugin:regexp/recommended',
		'plugin:xstate/all',
		'plugin:storybook/recommended',
		'plugin:@intlify/svelte/recommended',
		'plugin:json-schema-validator/recommended',
		'plugin:yml/standard',
		'plugin:toml/standard',
	),
	{
		files: ['**/*.svelte', '*.svelte'],

		languageOptions: {
			parser: parser_svelte,
			parserOptions: {
				parser: {
					js: parser_babel,
					ts: parser_TS,
					typescript: parser_TS,
				},
			},
		},
	},
	{
		files: ['**/*.stories.svelte', '**/*.stories.svelte'],

		rules: {
			'@intlify/svelte/no-raw-text': 'off',
		},
	},
	{
		files: ['**/*.json', '**/*.json5', '**/*.jsonc'],

		languageOptions: {
			ecmaVersion: 5,
			parser: parser_jsonc,
			parserOptions: {
				jsonSyntax: 'JSON5',
			},

			sourceType: 'script',
		},
	},
	{
		files: ['**/*.yaml', '**/*.yml'],

		languageOptions: {
			parser: parser_yaml,
		},
	},
	{
		files: ['**/*.toml'],

		languageOptions: {
			parser: parser_toml,
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],

		languageOptions: {
			parser: parser_TS,
			parserOptions: {
				extraFileExtensions: ['.svelte'],
			},
		},

		rules: {
			'@typescript-eslint/*': 'off',
		},
	},

	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'arrow-parens': 'off',
			'capitalized-comments': 'off',
			'consistent-return': 'off',
			'depend/ban-dependencies': [
				'warn',
				{
					presets: ['native', 'preferred'],
				},
			],
			'import-x/no-unresolved': 'off',
			'import/no-mutable-exports': 'off',
			'import/no-unassigned-import': 'off',
			indent: ['warn', 'tab'],
			'n/prefer-global/process': 'off',
			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
			'no-unused-expressions': 1,
			'no-unused-vars': 1,
			'no-warning-comments': 'off',
			'object-curly-spacing': 'off',
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-modules': 'off',
			'perfectionist/sort-objects': [
				'warn',
				{
					order: 'asc',
					type: 'natural',
				},
			],
			'prefer-const': 'off',
			semi: ['warn', 'never'],
			'semi-style': 'off',
			'sonarjs/no-unused-expressions': 'off',
			'sonarjs/sonar-no-unused-vars': 'off',
			'sonarjs/todo-tag': 'off',
			'svelte/derived-has-same-inputs-outputs': 'warn',
			'svelte/first-attribute-linebreak': 'off',
			'svelte/html-closing-bracket-spacing': 'warn',
			'svelte/indent': [
				'warn',
				{
					alignAttributesVertically: false,
					ignoredNodes: [],
					indent: 'tab',
					indentScript: false,
					switchCase: 1,
				},
			],
			'svelte/infinite-reactive-loop': 'error',

			'svelte/no-dupe-on-directives': 'warn',
			'svelte/no-dupe-use-directives': 'warn',
			'svelte/no-immutable-reactive-statements': 'warn',
			'svelte/no-reactive-functions': 'warn',
			'svelte/no-reactive-literals': 'warn',
			'svelte/no-reactive-reassign': 'warn',
			'svelte/no-spaces-around-equal-signs-in-attribute': 'warn',
			'svelte/no-store-async': 'warn',
			'svelte/no-target-blank': 'warn',
			'svelte/no-unused-class-name': [
				'off',
				{
					allowedClassNames: [],
				},
			],
			'svelte/prefer-destructured-store-props': 'warn',
			'svelte/prefer-style-directive': 'warn',
			'svelte/require-each-key': 'warn',
			'svelte/require-optimized-style-attribute': 'warn',
			'svelte/require-store-reactive-access': 'warn',
			'svelte/spaced-html-comment': 'warn',
			'svelte/valid-each-key': 'warn',
			'unicorn/filename-case': 'off',
			'unicorn/no-abusive-eslint-disable': 'off',
			'unicorn/no-array-callback-reference': 'off',
			'unicorn/prefer-spread': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/require-array-join-separator': 'off',
		},
	},
	eslintConfigPrettier,
]
