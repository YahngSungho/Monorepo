import presetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'

const config = {
	plugins: [
		tailwindcss(),
		presetEnv({
			autoprefixer: { grid: false },
			browsers: '> 0.2% and not dead',
			enableClientSidePolyfills: true,
			minimumVendorImplementations: 2,
			state: 2,
		}),
	],
}

export default config
