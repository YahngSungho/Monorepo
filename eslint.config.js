// import * as parser_mdx from 'eslint-mdx' <- parser 이거로 설정하면 오히려 eslint-plugin-mdx는 작동안함
// import security from 'eslint-plugin-security' <- @microsoft/eslint-plugin-sdl에서 중복 사용
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import json from '@eslint/json'
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
// import jsonSchema from 'eslint-plugin-json-schema-validator'
import jsonc from 'eslint-plugin-jsonc'
import * as mdx from 'eslint-plugin-mdx'
import noSecrets from 'eslint-plugin-no-secrets'
import nounsanitized from 'eslint-plugin-no-unsanitized'
import noUseExtendNative from 'eslint-plugin-no-use-extend-native'
import optimizeRegex from 'eslint-plugin-optimize-regex'
import perfectionist from 'eslint-plugin-perfectionist'
import playwright from 'eslint-plugin-playwright'
import promise from 'eslint-plugin-promise'
import ramda from 'eslint-plugin-ramda'
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

import svelteConfig from './libraries/base/svelte.config.js'

const baseRules = {
	'import-x/no-duplicates': 'off',
	'sonarjs/call-argument-line': 'off',
	'unicorn/no-null': 'off',
	'perfectionist/sort-named-imports': 'warn',
	'functional/no-class-inheritance': 'off',
	'functional/functional-parameters': 'off',
	'perfectionist/sort-named-exports': 'warn',
	'unicorn/import-style': 'off',
	'functional/immutable-data': 'off',
	'unicorn/no-useless-undefined': 'off',
	'unicorn/prefer-dom-node-dataset': 'off',
	'sonarjs/no-invariant-returns': 'warn',
	'sonarjs/cognitive-complexity': ['warn', 30],
	'promise/always-return': 'off',
	'unicorn/prefer-top-level-await': 'off',
	'unicorn/no-zero-fractions': 'off',
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
	'functional/no-expression-statements': ['off', { ignoreSelfReturning: true, ignoreVoid: true }],
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
	'svelte/no-navigation-without-base': 'off',
	'svelte/no-useless-mustaches': 'off',
	'svelte/valid-compile': [
		'error',
		{
			ignoreWarnings: true,
		},
	],
	'svelte/valid-style-parse': 'error',
	'svelte/derived-has-same-inputs-outputs': 'warn',
	'svelte/first-attribute-linebreak': 'off',
	'svelte/html-self-closing': [
		'warn',
		'default', // or "all" or "html" or "none"
	],
	'svelte/html-closing-bracket-spacing': 'warn',
	'svelte/html-quotes': [
		'warn',
		{
			prefer: 'double',
			dynamic: {
				quoted: false,
				avoidInvalidUnquotedInHTML: false,
			},
		},
	],
	'svelte/indent': 'off',
	'svelte/infinite-reactive-loop': 'error',
	'svelte/no-dupe-on-directives': 'warn',
	'svelte/prefer-destructured-store-props': 'warn',
	'svelte/no-dupe-use-directives': 'warn',
	'svelte/no-immutable-reactive-statements': 'warn',
	'svelte/no-reactive-functions': 'warn',
	'svelte/no-reactive-literals': 'warn',
	'svelte/no-reactive-reassign': 'warn',
	'svelte/no-spaces-around-equal-signs-in-attribute': 'warn',
	'svelte/no-store-async': 'warn',
	'svelte/no-target-blank': 'error',
	'svelte/sort-attributes': 'warn',
	'svelte/no-trailing-spaces': 'warn',
	'svelte/no-inner-declarations': 'warn',
	'sonarjs/prefer-single-boolean-return': 'off',
	'svelte/shorthand-attribute': 'warn',
	'svelte/shorthand-directive': 'warn',
	'svelte/no-unused-class-name': [
		'off',
		{
			allowedClassNames: [],
		},
	],
	'svelte/prefer-style-directive': 'off',
	'svelte/html-closing-bracket-new-line': 'warn',
	'svelte/prefer-class-directive': 'warn',
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
	indent: 'off',
	'ramda/always-simplification': 'warn',
	'ramda/any-pass-simplification': 'warn',
	'ramda/both-simplification': 'warn',
	'ramda/complement-simplification': 'warn',
	'ramda/compose-simplification': 'warn',
	'ramda/cond-simplification': 'warn',
	'ramda/either-simplification': 'warn',
	'ramda/eq-by-simplification': 'warn',
	'ramda/filter-simplification': 'warn',
	'ramda/if-else-simplification': 'warn',
	'ramda/map-simplification': 'warn',
	'ramda/merge-simplification': 'warn',
	'ramda/no-redundant-and': 'warn',
	'ramda/no-redundant-not': 'warn',
	'ramda/no-redundant-or': 'warn',
	'ramda/pipe-simplification': 'warn',
	'ramda/prefer-both-either': 'warn',
	'ramda/prefer-complement': 'warn',
	'ramda/prefer-ramda-boolean': 'warn',
	'ramda/prop-satisfies-simplification': 'warn',
	'ramda/reduce-simplification': 'warn',
	'ramda/reject-simplification': 'warn',
	'ramda/set-simplification': 'warn',
	'ramda/unless-simplification': 'warn',
	'ramda/when-simplification': 'warn',
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.join(__dirname, '.gitignore')
const flatCompat = new FlatCompat({
	allConfig: js.configs.all,
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
})

export default defineFlatConfig([
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['!.storybook', '**/.svelte-kit/**', 'pnpm-lock.yaml', 'package-lock.json', '**/cache.json'],
	},

	js.configs.recommended,
	unicorn.configs.recommended,
	sonarjs_configs.recommended,

	depend_configs['flat/recommended'],
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	...turboConfig,
	perfectionist.configs['recommended-natural'],
	noUseExtendNative.configs.recommended,
	promise.configs['flat/recommended'],
	functional.configs.externalVanillaRecommended,
	functional.configs.lite,
	functional.configs.stylistic,
	problems,
	...microsoftSdl.configs.recommended,
	regexp_configs['flat/recommended'],

	...storybook.configs['flat/recommended'],
	github.getFlatConfigs().browser,
	github.getFlatConfigs().recommended,
	nounsanitized.configs.recommended,
	arrayFunc.configs.recommended,
	compat.configs['flat/recommended'],

	...flatCompat.extends(
		'plugin:xstate/all',
		'plugin:redos/recommended',
	),

	{
		settings: {
			browserslistOpts: {
				env: 'defaults',
			},
			'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.svelte', '.json'],
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					alwaysTryTypes: true,
					project: ['apps/*/tsconfig.json', 'libraries/*/tsconfig.json', 'storybook/tsconfig.json'],
				}),
			],
			'import-x/resolver': {
				typescript: createTypeScriptImportResolver({
					project: [
						'./tsconfig.json',
						'./apps/*/tsconfig.json',
						'./libraries/*/tsconfig.json',
						'./storybook/tsconfig.json',
					],
				}),
			},
			svelte: {
				kit: {
					files: {
						routes: '**/src/routes',
					},
				},
			},
		},

		plugins: {
			ex: exceptionHandling,
			'no-secrets': noSecrets,
			'optimize-regex': optimizeRegex,
			redos,
			'simple-import-sort': simpleImportSort,
			sql,
			xstate,
			ramda,
		},

		rules: baseRules,
	},

	{
		files: ['**/*.js', '**/*.ts', '**/*.mjs', '**/*.cjs'],

		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.node,
				...globals.builtin,
				...globals.browser,
			},
			parser: parser_TS,
			parserOptions: {
				ecmaVersion: 'latest',
				extraFileExtensions: ['.svelte'],
				projectService: true,
				requireConfigFile: false,
				sourceType: 'module',
				allowDefaultProject: [
					'**/*.md/*.*',
					'**/*.mdc/*.*',
					'**/*.mdx/*.*',
				],
			},
			sourceType: 'module',
		},
	},

	...svelte.configs.recommended,
	...intlifySvelte.configs['flat/recommended'],
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
				extraFileExtensions: ['.svelte', '.svelte.js', '.svelte.ts'],
				parser: parser_TS,
				projectService: true,
				requireConfigFile: false,
				sourceType: 'module',
				allowDefaultProject: [
					'**/*.md/*.*',
					'**/*.mdc/*.*',
					'**/*.mdx/*.*',
				],
				svelteConfig,
				svelteFeatures: {
					experimentalRunes: true,
				},
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
			'**/e2e/**',
			'**/e2e/*.js',
			'*.test.js',
			'**/*.tests.js',
		],

		rules: {
			'functional/prefer-tacit': 'off',
			'no-unused-vars': 'off',
			'sonarjs/no-dead-store': 'off',
			'unicorn/no-array-method-this-argument': 'off',
			'array-func/no-unnecessary-this-arg': 'off',
			'@intlify/svelte/no-raw-text': 'off',
			'redos/no-vulnerable': 'off',
			'sonarjs/pseudo-random': 'off',
			'sonarjs/slow-regex': 'off',
			'svelte/no-useless-children-snippet': 'off',
		},
	},

	{
		files: ['**/e2e/*.js'],

		...playwright.configs['flat/recommended'],
		rules: {
			...playwright.configs['flat/recommended'].rules,
			'no-shadow': 'off',
			'playwright/no-conditional-in-test': 'off',
			'playwright/no-conditional-expect': 'off',
		},
	},

	{
		files: ['**/scripts/**/*.js'],

		rules: {
			'unicorn/no-process-exit': 'off'
		}
	},

	...jsonc.configs['flat/base'],
	...jsonc.configs['flat/recommended-with-json'],
	...jsonc.configs['flat/recommended-with-jsonc'],
	...jsonc.configs['flat/recommended-with-json5'],
	// ...jsonSchema.configs['flat/recommended'],
	{
		files: ['**/*.json', '**/*.json5', '**/*.jsonc'],

		languageOptions: {
			parser: parser_jsonc,
			parserOptions: {
				jsonSyntax: 'JSON5',
			},

			sourceType: 'script',
		},

		...json.configs.recommended,
	},

	...yml.configs['flat/standard'],
	{
		files: ['**/*.yaml', '**/*.yml'],

		languageOptions: {
			parser: parser_yaml,
		},
	},

	...toml.configs['flat/standard'],
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

	...markdown.configs.recommended,
	...markdown.configs.processor,

	{
		files: [
			'**/*.md/*.*',
			'**/*.mdc/*.*',
			'**/*.mdx/*.*',
		],
		languageOptions: {
			parserOptions: {
				project: undefined, // 타입 인식을 위한 tsconfig 사용 안 함
				projectService: false,
			},
		},
		rules: {
			'unicorn/prefer-module': 'off',
			'no-undef': 'off',
			'no-unused-expressions': 'off',
			'no-unused-vars': 'off',
			'sonarjs/no-unused-vars': 'off',
			'padded-blocks': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/dot-notation': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-duplicate-type-constituents': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-for-in-array': 'off',
			'@typescript-eslint/no-implied-eval': 'off',
			'@typescript-eslint/no-meaningless-void-operator': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/no-mixed-enums': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-throw-literal': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unnecessary-qualifier': 'off',
			'@typescript-eslint/no-unnecessary-type-arguments': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'@typescript-eslint/no-unnecessary-type-constraint': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'@typescript-eslint/prefer-as-const': 'off',
			'@typescript-eslint/prefer-find': 'off',
			'@typescript-eslint/prefer-includes': 'off',
			'@typescript-eslint/prefer-literal-enum-member': 'off',
			'@typescript-eslint/prefer-namespace-keyword': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
			'@typescript-eslint/prefer-readonly': 'off',
			'@typescript-eslint/prefer-readonly-parameter-types': 'off',
			'@typescript-eslint/prefer-reduce-type-parameter': 'off',
			'@typescript-eslint/prefer-regexp-exec': 'off',
			'@typescript-eslint/prefer-return-this-type': 'off',
			'@typescript-eslint/prefer-string-starts-ends-with': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/require-array-sort-compare': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/restrict-plus-operands': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/return-await': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/switch-exhaustiveness-check': 'off',
			'@typescript-eslint/triple-slash-reference': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/unified-signatures': 'off',
			'functional/no-promise-reject': 'off',
			'functional/immutable-data': 'off',
			'functional/prefer-immutable-types': 'off', // 오류 발생 규칙
			'functional/prefer-tacit': 'off',
			'functional/type-declaration-immutability': 'off',
			'promise/no-native': 'off',
			'ramda/prefer-ramda-boolean': 'off',
			'depend/ban-dependencies': 'off', // 타입 정보 필요
			'import-x/default': 'off', // 타입 정보 필요
			'import-x/named': 'off', // 타입 정보 필요
			'import-x/namespace': 'off', // 타입 정보 필요
			'import-x/no-cycle': 'off', // 타입 정보 필요
			'import-x/no-deprecated': 'off', // 타입 정보 필요
			'import-x/no-named-as-default': 'off', // 타입 정보 필요
			'import-x/no-named-as-default-member': 'off', // 타입 정보 필요
			'import-x/no-unused-modules': 'off', // 타입 정보 필요
		}
	},

	...jsonc.configs['flat/prettier'],
	...yml.configs['flat/prettier'],
	...svelte.configs.prettier,
	eslintConfigPrettier,

	{
		// 그냥 off 할 설정들
		rules: {
			'import/consistent-type-specifier-style': 'off',
			'import/default': 'off',
			'import/dynamic-import-chunkname': 'off',
			'import/enforce-node-protocol-usage': 'off',
			'import/export': 'off',
			'import/exports-last': 'off',
			'import/extensions': 'off',
			'import/first': 'off',
			'import/group-exports': 'off',
			'import/imports-first': 'off',
			'import/max-dependencies': 'off',
			'import/named': 'off',
			'import/namespace': 'off',
			'import/newline-after-import': 'off',
			'import/no-absolute-path': 'off',
			'import/no-amd': 'off',
			'import/no-anonymous-default-export': 'off',
			'import/no-commonjs': 'off',
			'import/no-cycle': 'off',
			'import/no-default-export': 'off',
			'import/no-deprecated': 'off',
			'import/no-duplicates': 'off',
			'import/no-dynamic-require': 'off',
			'import/no-empty-named-blocks': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-import-module-exports': 'off',
			'import/no-internal-modules': 'off',
			'import/no-mutable-exports': 'off',
			'import/no-named-as-default': 'off',
			'import/no-named-as-default-member': 'off',
			'import/no-named-default': 'off',
			'import/no-named-export': 'off',
			'import/no-namespace': 'off',
			'import/no-nodejs-modules': 'off',
			'import/no-relative-packages': 'off',
			'import/no-relative-parent-imports': 'off',
			'import/no-restricted-paths': 'off',
			'import/no-self-import': 'off',
			'import/no-unassigned-import': 'off',
			'import/no-unresolved': 'off',
			'import/no-unused-modules': 'off',
			'import/no-useless-path-segments': 'off',
			'import/no-webpack-loader-syntax': 'off',
			'import/order': 'off',
			'import/prefer-default-export': 'off',
			'import/unambiguous': 'off',
			'jsonc/no-comments': 'off',
		},
	},
])
