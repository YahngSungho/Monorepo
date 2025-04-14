export default function wallabyConfig (wallaby) {
	return {
		// ... 기존 설정 ...
		autoDetect: true,
		debug: true,
		trace: true,

		tests: ['**/src/**/*.test.*', '!**/e2e/**', '!**/node_modules/**'],
	}
}
