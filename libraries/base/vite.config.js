import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { FontaineTransform } from 'fontaine'
import { searchForWorkspaceRoot } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export let currentEnv
if (process.env.CI) {
	currentEnv = 'CI'
} else if (process.env.NODE_ENV === 'production') {
	currentEnv = 'build'
} else {
	currentEnv = 'dev'
}
export const isDev = currentEnv === 'dev'

const defaultFallbackFonts = [
	'Inter',                // fontaine DB에 있음, 모양 유사
	'Roboto',               // 안드로이드/크롬OS 기본
	'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'
]

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
		sourcemap: isDev ? true : 'hidden', // Sentry 설정에서 sourcemap 파일 지움
	},
	css: {
		devSourcemap: true,
	},
	envPrefix: ['PUBLIC_'],
	plugins: [
		// @ts-ignore
		tsconfigPaths(),
		// @ts-ignore
		tailwindcss(),
		// @ts-ignore
		FontaineTransform.vite({
			fallbacks: {
				 // 1. 기본 영문/라틴 (General Latin)
  'IBM Plex Sans': defaultFallbackFonts,

  // 2. 아랍어 (Arabic)
  'IBM Plex Sans Arabic': [
    'Segoe UI',             // 윈도우 (아랍어 지원 훌륭함)
    'Noto Naskh Arabic',    // 안드로이드/구글
    'Noto Sans Arabic',    // 안드로이드/구글
		'Arial',
  ].concat(defaultFallbackFonts),

  // 3. 중국어 간체 (Simplified Chinese)
  'IBM Plex Sans SC': [
    'Noto Sans SC',         // 안드로이드/리눅스 (fontaine 최적화)
  ].concat(defaultFallbackFonts),

  // 4. 중국어 번체 (Traditional Chinese)
  'IBM Plex Sans TC': [
    'Noto Sans TC',         // 안드로이드/리눅스 (fontaine 최적화)
  ].concat(defaultFallbackFonts),

  // 5. 일본어 (Japanese)
  'IBM Plex Sans JP': [
    'Noto Sans JP',              // 안드로이드/리눅스
  ].concat(defaultFallbackFonts),

  // 6. 한국어 (Korean)
  'IBM Plex Sans KR': [
    'Noto Sans KR',         // 안드로이드/리눅스
  ].concat(defaultFallbackFonts),

  // 7. 히브리어 (Hebrew)
  'IBM Plex Sans Hebrew': [
		'Arial Hebrew',
    'Segoe UI',             // 윈도우
    'Noto Sans Hebrew',     // 안드로이드
		'Arial',
  ].concat(defaultFallbackFonts),

  // 8. 데바나가리/힌디어 (Devanagari)
  'IBM Plex Sans Devanagari': [
		'Noto Sans Devanagari', // 안드로이드
		'Arial',
  ].concat(defaultFallbackFonts),

  // 9. 태국어 (Thai)
  'IBM Plex Sans Thai': [
		'Noto Sans Thai',       // 안드로이드
		'Arial',
  ].concat(defaultFallbackFonts),

  // 10. 모노스페이스 (Code/Monospace)
  'IBM Plex Mono': [
    'Courier New',          // 공통
    'Roboto Mono',          // 안드로이드
    'monospace'
  ],

  // 11. 수학 기호 (Math) - Serif 계열이 많음
  'IBM Plex Math': [
    'Times New Roman',      // 수학 기호 커버리지 좋음
    'serif'                 // Math는 보통 serif 형태임
  ]
			},
		}),
	],
	server: {
		fs: {
			allow: ['.', path.resolve(__dirname, './static'), searchForWorkspaceRoot(process.cwd())],
		},
	},
	// ssr: {
	// 	noExternal: ['bits-ui'],
	// },
	test: {
		exclude: ['**/e2e/**'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		outputFile: './vitest-report/result.xml',
		reporters: currentEnv === 'CI' ? ['junit', 'github-actions'] : 'default',
	},
})

// @ts-ignore
export const defaultConfig = mergeConfig(configDefaults, baseConfig)

export default defaultConfig
