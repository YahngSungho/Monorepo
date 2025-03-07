import path from 'node:path'
import { fileURLToPath } from 'node:url'

// import * as parser_mdx from 'eslint-mdx' <- parser 이거로 설정하면 오히려 eslint-plugin-mdx는 작동안함
// import security from 'eslint-plugin-security' <- @microsoft/eslint-plugin-sdl에서 중복 사용
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
import { defineFlatConfig } from 'eslint-define-config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import arrayFunc from 'eslint-plugin-array-func'
import compat from 'eslint-plugin-compat'
import { configs as depend_configs } from 'eslint-plugin-depend'
import { plugin as exceptionHandling } from 'eslint-plugin-exception-handling'
import functional from 'eslint-plugin-functional'
import github from 'eslint-plugin-github'
import importX from 'eslint-plugin-import-x'
import jsonSchema from 'eslint-plugin-json-schema-validator'
import jsonc from 'eslint-plugin-jsonc'
import lodash from 'eslint-plugin-lodash'
import * as mdx from 'eslint-plugin-mdx'
import noSecrets from 'eslint-plugin-no-secrets'
import nounsanitized from 'eslint-plugin-no-unsanitized'
import noUseExtendNative from 'eslint-plugin-no-use-extend-native'
import optimizeRegex from 'eslint-plugin-optimize-regex'
import perfectionist from 'eslint-plugin-perfectionist'
import playwright from 'eslint-plugin-playwright'
import promise from 'eslint-plugin-promise'
import redos from 'eslint-plugin-redos'
import { configs as regexp_configs } from 'eslint-plugin-regexp'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { configs as sonarjs_configs } from 'eslint-plugin-sonarjs'
import sql from 'eslint-plugin-sql'
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

export default defineFlatConfig([
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['!.storybook'],

		plugins: {
			ex: exceptionHandling,
			lodash,
			'no-secrets': noSecrets,
			'optimize-regex': optimizeRegex,
			redos,
			'simple-import-sort': simpleImportSort,
			sql,
			xstate,
		},

		settings: {
			browserslistOpts: {
				env: 'defaults',
			},
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
	...turboConfig,
	perfectionist.configs['recommended-natural'],
	noUseExtendNative.configs.recommended,
	promise.configs['flat/recommended'],
	functional.configs.externalVanillaRecommended,
	functional.configs.lite,
	functional.configs.stylistic,
	// functional.configs.disableTypeChecked,
	problems,
	...microsoftSdl.configs.recommended,
	regexp_configs['flat/recommended'],
	...intlifySvelte.configs['flat/recommended'],
	...storybook.configs['flat/recommended'],
	...yml.configs['flat/standard'],
	...toml.configs['flat/standard'],
	github.getFlatConfigs().browser,
	github.getFlatConfigs().recommended,
	nounsanitized.configs.recommended,
	arrayFunc.configs.recommended,
	compat.configs['flat/recommended'],
	...jsonc.configs['flat/base'],
	...jsonc.configs['flat/recommended-with-json'],
	...jsonc.configs['flat/recommended-with-jsonc'],
	...jsonc.configs['flat/recommended-with-json5'],
	...jsonSchema.configs['flat/recommended'],
	...markdown.configs.recommended,
	...flatCompat.extends(
		'plugin:xstate/all',
		'plugin:lodash/recommended',
		'plugin:redos/recommended',
	),

	{
		rules: {
			'perfectionist/sort-exports': 'off',
			'no-shadow': 'warn',
			'unicorn/no-empty-file': 'off',
			'unicorn/no-array-reduce': 'off',
			'ex/no-unhandled': 'off',
			'sonarjs/no-unused-collection': 'off',
			'sonarjs/no-empty-test-file': 'off',
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
			'functional/functional-parameters': 'warn',
			'functional/immutable-data': 'warn',
			'functional/no-expression-statements': [
				'off',
				{ ignoreSelfReturning: true, ignoreVoid: true },
			],
			'functional/no-let': 'off',
			'functional/no-loop-statements': 'off',
			'functional/no-return-void': 'off',
			'functional/no-throw-statements': 'off',
			'github/filenames-match-regex': 'off',
			'i18n-text/no-en': 'off',
			'import-x/no-unresolved': 'off',
			'import/extensions': 'off',
			'import/no-namespace': 'off',
			'import/no-nodejs-modules': 'off',
			'import/no-unresolved': 'off',
			indent: ['warn', 'tab'],
			'lodash/prefer-constant': 'off',
			'lodash/prefer-get': 'off',
			'lodash/prefer-includes': 'off',
			'lodash/prefer-is-nil': 'off',
			'lodash/prefer-lodash-chain': 'off',
			'lodash/prefer-lodash-method': 'off',
			'lodash/prefer-lodash-typecheck': 'off',
			'lodash/prefer-matches': 'off',
			'lodash/prefer-noop': 'off',
			'lodash/prefer-over-quantifier': 'off',
			'lodash/prefer-some': 'off',
			'lodash/prefer-startswith': 'off',
			'lodash/prefer-times': 'off',
			'n/no-extraneous-import': 'off',
			'n/no-missing-import': 'off',
			'n/prefer-global/process': 'off',
			'no-console': 'off',
			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
			'no-secrets/no-secrets': ['error', { tolerance: 4.3 }],
			'no-unused-expressions': 1,
			'no-unused-vars': 1,
			'no-warning-comments': 'off',
			'object-curly-spacing': 'off',
			'optimize-regex/optimize-regex': 'warn',
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-modules': 'off',
			'perfectionist/sort-objects': [
				'off',
				{
					order: 'asc',
					type: 'natural',
				},
			],
			'prefer-const': 'off',
			'prettier/prettier': [
				'off',
				{
					endOfLine: 'auto',
				},
			],
			semi: ['warn', 'never'],
			'semi-style': 'off',
			'simple-import-sort/exports': 'warn',
			'simple-import-sort/imports': 'warn',
			'sonarjs/no-commented-code': 'off',
			'sonarjs/no-small-switch': 'off',
			'sonarjs/no-unused-expressions': 'off',
			'sonarjs/sonar-no-unused-vars': 'off',
			'sonarjs/todo-tag': 'off',
			'sql/format': 'warn',
			'sql/no-unsafe-query': 'warn',
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

	{
		files: ['**/*.js', '**/*.ts', '**/*.mjs', '**/*.cjs'],

		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: parser_TS,
			parserOptions: {
				ecmaVersion: 'latest',
				extraFileExtensions: ['.svelte'],
				projectService: true,
				requireConfigFile: false,
				sourceType: 'module',
			},
			sourceType: 'module',
		},
	},

	{
		files: [
			'**/*.svelte',
			'*.svelte',
			'**/*.svelte.js',
			'*.svelte.js',
			'**/*.svelte.ts',
			'*.svelte.ts',
		],

		languageOptions: {
			parser: parser_svelte,
			parserOptions: {
				ecmaVersion: 'latest',
				extraFileExtensions: ['.svelte'],
				projectService: true,
				parser: {
					js: parser_TS,
					ts: parser_TS,
					typescript: parser_TS,
				},
				requireConfigFile: false,
				sourceType: 'module',
			},
		},

		rules: {
			'sonarjs/no-unused-vars': 'off',
			'sonarjs/no-use-of-empty-return-value': 'off',
		},
	},
	{
		files: [
			'**/*.stories.svelte',
			'*.stories.svelte',
			'**/*.test.js',
			'**/e2e/*.test.js',
			'*.test.js',
			'**/*.tests.js',
		],

		rules: {
			'@intlify/svelte/no-raw-text': 'off',
			'redos/no-vulnerable': 'off',
			'sonarjs/slow-regex': 'off',
		},
	},
	{
		files: ['**/e2e/*.test.js'],

		...playwright.configs['flat/recommended'],
		rules: {
			...playwright.configs['flat/recommended'].rules,
			// Customize Playwright rules
			// ...
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
		files: ['**/*.mdx'],

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
		files: ['**/*.mdx'],

		...mdx.flatCodeBlocks,
		rules: {
			...mdx.flatCodeBlocks.rules,
			// if you want to override some rules for code blocks
		},
	},

	...jsonc.configs['flat/prettier'],
	...yml.configs['flat/prettier'],
	...svelte.configs['flat/prettier'],
	eslintConfigPrettier,
])
