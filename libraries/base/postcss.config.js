import presetEnv from 'postcss-preset-env'
// import tailwindcss from '@tailwindcss/postcss'
// Todo: sveltekit에서 postcss.config.js가 의미가 있는 거 맞는지 체크... 혹시 vite.config.js 이거에서 다 설정 되는 거고 이 파일에 적힌 것들은 의미 없는 거 아님?
const config = {
	plugins: [
		// tailwindcss(),
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
