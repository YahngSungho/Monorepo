import path from 'node:path'
import { fileURLToPath } from 'node:url'

import postcssGlobalData from '@csstools/postcss-global-data'
import tailwindcss from '@tailwindcss/postcss'
import presetEnv from 'postcss-preset-env'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
	plugins: [
		postcssGlobalData({
			// presetEnv보다 먼저 실행되도록 추가
			files: [path.resolve(__dirname, './src/openProps-props-media.css')],
		}),
		tailwindcss(),
		presetEnv({
			autoprefixer: { grid: false },
			enableClientSidePolyfills: true,
			minimumVendorImplementations: 2,
			stage: 3,
		}),
	],
}

export default config
