import path from 'node:path'
import postcssJitProps from 'postcss-jit-props'

const config = {
	plugins: [
		postcssJitProps({
			files: [
				path.resolve('node_modules/open-props/open-props.min.css'),
			],
		}),
	],
}

export default config
