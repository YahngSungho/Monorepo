/* eslint-disable unicorn/no-anonymous-default-export */
// @ts-nocheck
export default function (wallaby) {
	return {
		// ... 기존 설정 ...
		autoDetect: true,
		debug: true,
		trace: true,

		  testFramework: {
    configFile: './libraries/base/vite.config.js'
  }
	}
}
