import presetEnv from 'postcss-preset-env'
import tailwindcss from '@tailwindcss/postcss'
const config = {
	plugins: [
		tailwindcss(),
		presetEnv({
			autoprefixer: { grid: false },
			enableClientSidePolyfills: true,
			minimumVendorImplementations: 2,
			stage: 2,
		}),
	],
}

export default config
