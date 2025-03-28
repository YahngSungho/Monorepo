// gremlins import 제거
// import gremlins from 'gremlins.js'

/**
 * 페이지 컨텍스트에서 Gremlins를 실행합니다. Playwright와 함께 사용하기 위한 함수입니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>} - Promise 객체
 */
async function unleashGremlins(page) {
	// gremlins.js 스크립트를 페이지에 추가 (테스트 파일에서 호출하므로 여기서 제거 가능)
	// await page.addScriptTag({
	// 	path: '../node_modules/gremlins.js/dist/gremlins.min.js', // 경로 수정 금지
	// })

	// 에러 핸들링 (테스트 파일에서 처리하므로 제거)
	// page.on('pageerror', (err) => {
	// 	throw err
	// })

	// Horde 생성 및 실행
	await page.evaluate(async () => {
		// @ts-ignore - window.gremlins는 addScriptTag/addInitScript에 의해 로드됨
		const horde = globalThis.gremlins.createHorde({
			species: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.clicker({
					clickTypes: ['click'],
					canClick: (element) => true,
					showAction: (x, y) => {
						// 클릭 위치 시각화 (옵션)
						const div = document.createElement('div')
						div.style.position = 'absolute'
						div.style.width = '5px'
						div.style.height = '5px'
						div.style.backgroundColor = 'red'
						div.style.borderRadius = '50%'
						div.style.left = `${x}px`
						div.style.top = `${y}px`
						div.style.zIndex = '10000'
						document.body.append(div)
						setTimeout(() => div.remove(), 100)
					},
				}),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.toucher(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.formFiller(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.scroller(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.typer(),
			],
			mogwais: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.mogwais.alert(),
				// @ts-ignore - 타입 오류 무시
				// window.gremlins.mogwais.gizmo(), // Gizmo 제거
			],
			strategies: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.strategies.distribution({
					distribution: [0.5, 0.1, 0.2, 0.1, 0.1], // 클릭 확률 높게
					delay: 10,
				}),
				// 필요 시 다른 전략 추가 가능
				// window.gremlins.strategies.allTogether({ nb: 500 }),
				// window.gremlins.strategies.bySpecies(),
			],
		})

		// unleash()가 반환하는 Promise를 직접 await
		// 에러 발생 시 page.evaluate가 reject되어 Playwright 테스트 실패 유발
		await horde.unleash({ nb: 500 }) // 500번의 액션 수행
		console.log('Gremlins 공격 완료')
	})
}

export { unleashGremlins }
