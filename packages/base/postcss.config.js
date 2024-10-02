import openProps from 'open-props'
import postcssJitProps from 'postcss-jit-props'
import presetEnv from 'postcss-preset-env'

const config = {
	plugins: [
		postcssJitProps(openProps),
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
