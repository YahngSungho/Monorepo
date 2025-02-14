import path from 'node:path'
import { fileURLToPath } from 'node:url'

import parser_babel from '@babel/eslint-parser'
import { includeIgnoreFile } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import markdown from '@eslint/markdown'
import intlifySvelte from '@intlify/eslint-plugin-svelte'
import microsoftSdl from '@microsoft/eslint-plugin-sdl'
import * as parser_TS from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import problems from 'eslint-config-problems'
import turboConfig from 'eslint-config-turbo/flat'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import arrayFunc from 'eslint-plugin-array-func'
import compat from 'eslint-plugin-compat'
import { configs as depend_configs } from 'eslint-plugin-depend'
import functional from 'eslint-plugin-functional'
import github from 'eslint-plugin-github'
import importX from 'eslint-plugin-import-x'
import jsonSchema from 'eslint-plugin-json-schema-validator'
import jsonc from 'eslint-plugin-jsonc'
import lodash from 'eslint-plugin-lodash'
import * as mdx from 'eslint-plugin-mdx'
import nounsanitized from 'eslint-plugin-no-unsanitized'
import noUseExtendNative from 'eslint-plugin-no-use-extend-native'
import perfectionist from 'eslint-plugin-perfectionist'
import promise from 'eslint-plugin-promise'
import { configs as regexp_configs } from 'eslint-plugin-regexp'
// import security from 'eslint-plugin-security' -> @microsoft/eslint-plugin-sdl에서 중복 사용
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { configs as sonarjs_configs } from 'eslint-plugin-sonarjs'
import storybook from 'eslint-plugin-storybook'
import svelte from 'eslint-plugin-svelte'
import toml from 'eslint-plugin-toml'
import unicorn from 'eslint-plugin-unicorn'
import xstate from 'eslint-plugin-xstate'
import yml from 'eslint-plugin-yml'
import globals from 'globals'
import parser_jsonc from 'jsonc-eslint-parser'
import * as parser_svelte from 'svelte-eslint-parser'
import parser_toml from 'toml-eslint-parser'
import parser_yaml from 'yaml-eslint-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const flatCompat = new FlatCompat({
	allConfig: js.configs.all,
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
})
const gitignorePath = path.join(__dirname, '.gitignore')

export default [
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['!.storybook'],

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
			lodash,
			'simple-import-sort': simpleImportSort,
			xstate,
		},

		settings: {
			'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.svelte', '.json'],
			'import-x/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					alwaysTryTypes: true,
					project: ['apps/*/tsconfig.json', 'libraries/*/tsconfig.json', 'storybook/tsconfig.json'],
				}),
			],
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
	depend_configs['flat/recommended'],
	unicorn.configs['flat/recommended'],
	sonarjs_configs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	...turboConfig,
	perfectionist.configs['recommended-natural'],
	noUseExtendNative.configs.recommended,
	promise.configs['flat/recommended'],
	functional.configs.externalVanillaRecommended,
	functional.configs.recommended,
	functional.configs.stylistic,
	functional.configs.disableTypeChecked,
	problems,
	...microsoftSdl.configs.recommended,
	regexp_configs['flat/recommended'],
	...intlifySvelte.configs['flat/recommended'],
	...storybook.configs['flat/recommended'],
	...jsonc.configs['flat/base'],
	...jsonc.configs['flat/recommended-with-json'],
	...jsonc.configs['flat/recommended-with-jsonc'],
	...jsonc.configs['flat/recommended-with-json5'],
	...jsonSchema.configs['flat/recommended'],
	...jsonc.configs['flat/prettier'],
	...yml.configs['flat/standard'],
	...yml.configs['flat/prettier'],
	...toml.configs['flat/standard'],
	github.getFlatConfigs().browser,
	github.getFlatConfigs().recommended,
	nounsanitized.configs.recommended,
	arrayFunc.configs.recommended,
	compat.configs['flat/recommended'],
	...markdown.configs.recommended,
	...flatCompat.extends('plugin:xstate/all', 'plugin:lodash/recommended'),
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
		...mdx.flat,
		// optional, if you want to lint code blocks at the same
		processor: mdx.createRemarkProcessor({
			// optional, if you want to disable language mapper, set it to `false`
			// if you want to override the default language mapper inside, you can provide your own
			languageMapper: {},
			lintCodeBlocks: true,
		}),
	},
	{
		...mdx.flatCodeBlocks,
		rules: {
			...mdx.flatCodeBlocks.rules,
			// if you want to override some rules for code blocks
			'no-var': 'error',
			'prefer-const': 'error',
		},
	},

	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'arrow-parens': 'off',
			camelcase: 'off',
			'capitalized-comments': 'off',
			'consistent-return': 'off',
			'depend/ban-dependencies': [
				'warn',
				{
					presets: ['native', 'preferred'],
				},
			],
			'eslint-comments/no-unlimited-disable': 'off',
			'eslint-comments/no-use': 'off',
			'functional/no-let': 'off',
			'github/filenames-match-regex': 'off',
			'import-x/no-unresolved': 'off',
			'import/no-namespace': 'off',
			'import/no-nodejs-modules': 'off',
			'import/no-unresolved': 'off',
			indent: ['warn', 'tab'],
			'n/no-extraneous-import': 'off',
			'n/no-missing-import': 'off',
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
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
			semi: ['warn', 'never'],
			'semi-style': 'off',
			'simple-import-sort/exports': 'warn',
			'simple-import-sort/imports': 'warn',
			'sonarjs/no-unused-expressions': 'off',
			'sonarjs/sonar-no-unused-vars': 'off',
			'sonarjs/todo-tag': 'off',
			'svelte/derived-has-same-inputs-outputs': 'warn',
			'svelte/first-attribute-linebreak': 'off',
			'svelte/html-closing-bracket-spacing': 'warn',
			'svelte/indent': 'off',
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
