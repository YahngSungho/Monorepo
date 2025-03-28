/**
 * @file Storybook UI 컴포넌트에 대한 범용 테스트 유틸리티 - 고급 디버깅 개선 버전 모든 Presentational 컴포넌트에 적용 가능한 범용성을 목표로
 *   작성됨.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

import { R } from '@library/helpers/R'
import { expect, test } from '@playwright/test'
import fc from 'fast-check'

/**
 * 인터랙션 타입 정의
 *
 * @typedef {Object} Interaction
 * @property {string} type - 인터랙션 타입 (click, fill, select 등)
 * @property {string} selector - 대상 요소의 셀렉터
 * @property {any} [value] - 인터랙션에 필요한 값 (fill, select 등에 사용)
 * @property {string} [valueType] - 입력 시 값 타입 (text, email, number, textarea 등)
 * @property {number} [min] - Range 최소값 (setRange에 사용)
 * @property {number} [max] - Range 최대값 (setRange에 사용)
 * @property {string[]} [options] - Select 옵션 (select에 사용)
 */

/**
 * 단계 추적 객체 타입 정의
 *
 * @typedef {Object} StepTracker
 * @property {number | undefined} currentStep - 현재 실행 중인 단계 번호
 * @property {Interaction | undefined} currentInteraction - 현재 실행 중인 인터랙션
 */

/**
 * 테스트 설정 정의
 *
 * @typedef {Object} TestConfig
 * @property {number} [iterationCount=3] - 인터랙션 시퀀스 반복 횟수. Default is `3`
 * @property {number} [sequenceLength=5] - 각 테스트 시퀀스의 인터랙션 수. Default is `5`
 * @property {number} [numRuns=10] - Fast-check 실행 횟수. Default is `10`
 * @property {string} [componentSelector='#storybook-root'] - 컴포넌트의 기본 셀렉터. Default is
 *   `'#storybook-root'`
 * @property {number} [waitAfterInteraction=100] - 각 인터랙션 후 대기 시간(ms). Default is `100`
 * @property {boolean} [resetComponent=false] - 반복마다 컴포넌트 상태 초기화를 할 것인지 여부. Default is `false`
 * @property {string} [debugLogDir='./test-results/debug-logs'] - 디버그 로그 저장 디렉토리. Default is
 *   `'./test-results/debug-logs'`
 * @property {boolean} [verbose=false] - 상세 로그 출력 여부. Default is `false`
 */

/**
 * 테스트 반복 정보
 *
 * @typedef {Object} IterationInfo
 * @property {number} iterationNumber - 반복 횟수
 * @property {{
 * 	results: InteractionResult[]
 * 	errors: { message: string; stack: string }[]
 * 	startTime: string
 * }[]} sequences
 *   - 시퀀스 정보
 *
 * @property {{ message: string; stack: string }[]} errors - 발생한 에러 목록
 * @property {string} [stateSummary] - 상태 요약
 * @property {boolean} [noInteractions] - 인터랙션 없음 여부
 * @property {string} startTime - 시작 시간
 * @property {string} [endTime] - 종료 시간
 * @property {{ isVisible: boolean; summary: string }} [finalState] - 최종 상태
 * @property {{
 * 	counterExample: Interaction[]
 * 	error: { message: string; stack: string }
 * 	property: string
 * }} [failureInfo]
 *   - 실패 정보
 *
 * @property {boolean} success - 성공 여부
 */

/**
 * 디버깅 정보 객체
 *
 * @typedef {Object} DebugInfo
 * @property {string} componentName - 컴포넌트 이름
 * @property {{ message: string; stack: string }[]} errors - 발생한 에러 목록
 * @property {object} [counterExample] - Fast-check의 반례 데이터
 * @property {string} [state] - DOM 상태 요약
 * @property {string} [timestamp] - 발생 시간
 * @property {string} url - 테스트 페이지 URL
 * @property {TestConfig} testConfig - 테스트 설정
 * @property {IterationInfo[]} iterations - 테스트 반복 정보
 * @property {boolean} success - 테스트 성공 여부
 * @property {string} [debugFilePath] - 디버그 정보 파일 경로
 */

/**
 * 시퀀스 정보 타입 정의
 *
 * @typedef {Object} SequenceInfo
 * @property {any[]} results - 인터랙션 실행 결과
 * @property {any[]} errors - 발생한 에러 목록
 * @property {string} startTime - 시작 시간
 * @property {string} [endTime] - 종료 시간
 * @property {string} [finalState] - 최종 상태
 */

/**
 * 브라우저 컨텍스트 내에서 직접 요소 정보와 선택자를 추출
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {string} componentSelector - 컴포넌트의 최상위 셀렉터
 * @returns {Promise<any[]>} 요소 정보 배열
 */
async function discoverInteractions(page, componentSelector) {
	// page.$ 대신 locator 사용 고려했으나, evaluate 내 복잡한 DOM 탐색 로직으로 인해 유지
	const rootComponentExists = await page.evaluate(
		(selector) => !!document.querySelector(selector),
		componentSelector,
	)
	if (!rootComponentExists) return []

	// 브라우저 컨텍스트 내에서 직접 요소 정보와 선택자를 추출
	// Playwright Locator API로는 브라우저 내부의 복잡한 DOM 순회 및 속성 접근 로직을
	// 효과적으로 대체하기 어려워 page.evaluate 유지.
	const elementInfos = await page.evaluate((componentSelector) => {
		// 브라우저 컨텍스트 내에서 getUniqueSelector 함수 재정의
		function getUniqueSelector(el, base) {
			let testId = el.getAttribute('data-testid')
			if (testId) {
				return `${base} [data-testid="${testId}"]` // data-testid 속성이 있으면 최우선 사용
			} else if (el.id) {
				return `${base} #${el.id}` // id가 있으면 두 번째 우선순위로 사용
			}
			// 위 조건을 만족하지 않으면 DOM 계층 구조를 이용한 선택자 생성
			if (el.parentElement) {
				let children = Array.from(el.parentElement.children)
				let index = children.indexOf(el) + 1
				return `${base} ${el.tagName.toLowerCase()}:nth-child(${index})`
			}
			return base
		}

		const root = document.querySelector(componentSelector)
		if (!root) return []

		// 모든 하위 요소에 대한 필요 정보 추출
		return Array.from(root.querySelectorAll('*'), (el) => {
			const uniqueSelector = getUniqueSelector(el, componentSelector)
			return {
				tagName: el.tagName.toLowerCase(),
				selector: uniqueSelector,
				type: el.getAttribute('type'),
				role: el.getAttribute('role'),
				disabled: el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true', // aria-disabled 추가
				readonly: el.hasAttribute('readonly'),
				options:
					el.tagName.toLowerCase() === 'select' ?
						Array.from(el.querySelectorAll('option'), (option) => option.value)
					:	[],
				min: el.hasAttribute('min') ? Number.parseInt(el.getAttribute('min') || '0', 10) : 0,
				max: el.hasAttribute('max') ? Number.parseInt(el.getAttribute('max') || '100', 10) : 100,
				draggable: el.getAttribute('draggable') === 'true',
				hasOnClick: el.hasAttribute('onclick'),
			}
		})
	}, componentSelector)

	// 각 요소에 대해 가시성 체크 및 인터랙션 생성
	const interactions = []
	for (const elementInfo of elementInfos) {
		// locator 사용
		const locator = page.locator(elementInfo.selector)
		// isVisible 대신 locator.isVisible 사용
		const isVisible = await locator.isVisible()
		if (!isVisible) continue

		// 요소 정보를 기반으로 가능한 인터랙션 생성 (elementInfo에서 disabled 체크는 이미 evaluate에서 수행)
		interactions.push(...getInteractionsFromElementInfo(elementInfo))
	}

	return interactions
}

/**
 * 요소 정보에서 가능한 인터랙션을 생성합니다.
 *
 * @param {object} elementInfo - 요소 정보 객체
 * @returns {Interaction[]} 가능한 인터랙션 목록
 */

function getInteractionsFromElementInfo(elementInfo) {
	const interactions = []
	const {
		tagName,
		selector,
		type,
		role,
		disabled,
		readonly,
		options,
		min,
		max,
		draggable,
		hasOnClick,
	} = elementInfo

	if (disabled) return []

	switch (tagName) {
		case 'a':
		case 'button': {
			interactions.push({ type: 'click', selector }, { type: 'hover', selector })
			// interactions.push({ type: 'hover', selector })
			// interactions.push({ type: 'click', selector })
			break
		}

		case 'input': {
			switch (type) {
				case '':
				case 'email':
				case 'number':
				case 'password':
				case 'search':
				case 'text':
				case undefined: {
					if (!readonly) {
						interactions.push({
							type: 'fill',
							selector,
							valueType: type || 'text',
						})
					}
					break
				}

				case 'checkbox':
				case 'radio': {
					interactions.push({ type: 'click', selector })
					break
				}

				case 'range': {
					interactions.push({
						type: 'setRange',
						selector,
						min,
						max,
					})
					break
				}
			}
			break
		}

		case 'select': {
			if (options.length > 0) {
				interactions.push({ type: 'select', selector, options })
			}
			break
		}

		case 'textarea': {
			if (!readonly) {
				interactions.push({ type: 'fill', selector, valueType: 'textarea' })
			}
			break
		}
	}

	if (role === 'button' || hasOnClick) {
		interactions.push({ type: 'click', selector }, { type: 'hover', selector })
	}

	if (['listbox', 'menu', 'tablist'].includes(role)) {
		interactions.push({ type: 'click', selector })
	}

	if (draggable) {
		interactions.push({ type: 'drag', selector })
	}

	return interactions
}

/**
 * 컴포넌트 상태를 초기화할 수 있는 함수 (페이지 내 global reset 함수가 존재하는 경우) 존재하지 않으면 아무 작업도 하지 않음.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 */
async function resetComponentState(page) {
	// 페이지에 정의된 resetComponentState 함수가 있으면 호출
	// 스토리북에서 특별히 리셋 함수를 제공하는 경우 사용
	try {
		// 전역 범위 함수 호출 필요하므로 page.evaluate 유지
		const hasResetFunction = await page.evaluate(
			() => {
				if (typeof globalThis.resetComponentState === 'function') {
					globalThis.resetComponentState()
					return true // 함수가 존재하고 실행됨
				}
				return false // 함수가 존재하지 않음
			},
			{ timeout: 1000 },
		)

		// 함수가 없으면 페이지 리로드
		if (!hasResetFunction) {
			await page.reload()
			// 페이지가 완전히 로드될 때까지 대기
			await page.waitForLoadState('domcontentloaded')
		}
	} catch (error) {
		console.warn('컴포넌트 상태 초기화 중 오류 발생:', error.message)
		// 오류가 발생한 경우에도 페이지 리로드 시도
		try {
			console.log('오류 발생으로 페이지를 리로드합니다.')
			await page.reload()
			await page.waitForLoadState('domcontentloaded')
		} catch (reloadError) {
			console.warn('페이지 리로드 중 오류 발생:', reloadError.message)
		}
	}
}

/**
 * 인터랙션 실행 결과 객체
 *
 * @typedef {Object} InteractionResult
 * @property {boolean} success - 인터랙션 성공 여부
 * @property {string} [errorMessage] - 에러 메시지
 * @property {any} [value] - 인터랙션 결과 값 (필요한 경우)
 * @property {string} [message] - 추가 정보
 * @property {string} [errorStack] - 에러 스택 추적
 * @property {Error} [error] - 원본 에러 객체
 */

let currentInteraction // 현재 실행 중인 인터랙션을 추적하기 위한 변수

/**
 * 주어진 타입과 옵션에 맞는 fast-check 값 Arbitrary를 생성합니다. 숫자 타입은 문자열로 변환됩니다.
 *
 * @param {string} valueType - 값 유형 (text, email, number, textarea, select, range 등)
 * @param {object} [options={}] - 추가 옵션 (min, max, select 옵션 목록 등). Default is `{}`
 * @param {number} [options.min] - Range 최소값
 * @param {number} [options.max] - Range 최대값
 * @param {string[]} [options.options] - Select 옵션 목록
 * @returns {fc.Arbitrary<string | number>} 생성된 값 Arbitrary
 */
function _getValueArbitraryForType(valueType, options = {}) {
	switch (valueType) {
		case 'email': {
			return fc.emailAddress()
		}
		case 'number': {
			// page.fill은 문자열을 기대하므로 숫자를 문자열로 변환
			return fc.integer(options).map(String)
		}
		case 'range': {
			// range input은 보통 숫자를 직접 다루므로 변환 불필요 (evaluate에서 처리)
			// 단, locator.fill을 사용한다면 문자열 변환 필요할 수 있음
			return fc.integer({ min: options.min ?? 0, max: options.max ?? 100 })
		}
		case 'select': {
			if (options.options && options.options.length > 0) {
				return fc.constantFrom(...options.options)
			}
			// 선택할 옵션이 없으면 기본값 또는 에러 처리 필요 -> 여기서는 빈 문자열 반환 (혹은 fc.constant('') 등)
			// Arbitrary 생성 단계에서는 에러보다 기본값 반환이 나을 수 있음
			return fc.constant('')
		}
		case 'textarea': {
			// 여러 줄 텍스트 가능성 고려
			return fc.string().map((str) => `테스트 텍스트 ${str}`) // 이해하기 쉽게 접두사 추가
		}
		// 'text', 'password', 'search' 등 기본 문자열 타입
		default: {
			// 빈 문자열 포함 가능하도록 fc.string 사용
			return fc.string().map((str) => {
				// 너무 짧은 문자열은 접두사 추가
				return str.length < 3 ? `테스트 입력 ${str}` : str
			})
		}
	}
}

/**
 * 안전한 난수 생성을 위한 유틸리티 함수
 *
 * @param {number} min - 최소값 (포함)
 * @param {number} max - 최대값 (포함)
 * @returns {number} Min과 max 사이의 난수
 */
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 테스트용 랜덤 문자열을 생성합니다.
 *
 * @returns {string} 랜덤 문자열
 */
function getRandomString() {
	return Math.random().toString(36).slice(2, 8)
}

/**
 * 각 valueType에 맞는 랜덤 값을 생성합니다. 참고: 이 함수는 이제 주로 legacy 코드에서 사용됩니다. 새로운 값 생성은
 * _getValueArbitraryForType 함수를 사용하세요.
 *
 * @param {string} valueType - 값 유형 (email, number, textarea 등)
 * @returns {string} 생성된 값
 */
function getRandomValueForType(valueType) {
	switch (valueType) {
		case 'email': {
			return `test${getRandomString()}@example.com`
		}
		case 'number': {
			return getRandom(0, 100).toString()
		}
		case 'textarea': {
			return `테스트 텍스트 ${getRandomString()}`
		}
		default: {
			return `테스트 입력 ${getRandomString()}`
		}
	}
}

/**
 * 인터랙션 실행 - 주어진 상호작용을 페이지에서 실제로 수행합니다. 각 인터랙션 타입(클릭, 입력, 드래그 등)에 맞는 Playwright 액션을 실행합니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Interaction} interaction - 실행할 인터랙션
 * @param {number} waitTime - 인터랙션 후 대기 시간(ms)
 * @param {boolean} verbose - 상세 로그 출력 여부
 * @returns {Promise<InteractionResult>} 인터랙션 실행 결과
 */
async function executeInteraction(page, interaction, waitTime, verbose = false) {
	// 결과 객체 초기화
	const result = {
		success: false,
		type: interaction.type,
		selector: interaction.selector,
		timestamp: new Date().toISOString(),
		// 상세 정보를 위한 필드 추가
		details: {},
	}

	// 현재 실행 중인 인터랙션 정보 설정
	currentInteraction = {
		...interaction,
		timestamp: result.timestamp,
		id: `${interaction.type}-(${interaction.selector})-${result.timestamp}`,
	}

	// 상세 로그 출력
	if (verbose) {
		console.log(`실행 인터랙션: ${interaction.type} on (${interaction.selector})`)
	}

	// 페이지 에러 핸들러 설정 - 에러가 발생해도 인터랙션 계속 진행
	let pageErrorOccurred = false
	let pageErrorMessage = ''

	const pageErrorHandler = (error) => {
		pageErrorOccurred = true
		pageErrorMessage = error.message
		console.error(`페이지 에러 발생 (계속 진행): ${error.message}`)
	}

	// 페이지 에러 이벤트 리스너 추가
	page.on('pageerror', pageErrorHandler)

	try {
		// 대상 요소를 locator로 가져옴
		const locator = page.locator(interaction.selector)

		// 요소 존재 및 가시성 확인 (locator 사용)
		const isVisible = await locator.isVisible()
		if (!isVisible) {
			// isVisible()이 false를 반환하면 요소가 없거나 보이지 않음
			const error = new Error(
				`요소가 화면에 표시되지 않거나 존재하지 않음: (${interaction.selector})`,
			)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result
		}

		// 요소가 disabled 상태인지 확인 (locator 사용)
		const isDisabled = await locator.isDisabled() // isDisabled()는 disabled 속성과 aria-disabled="true" 모두 확인

		if (isDisabled) {
			const error = new Error(`요소가 비활성화됨: (${interaction.selector})`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result
		}

		// 인터랙션 타입에 따른 처리
		// executeInteractionByType 내에서 locator를 사용할 수 있도록 locator 전달 또는 selector만 사용
		await executeInteractionByType(page, interaction, result) // locator 대신 selector 기반으로 동작하도록 유지

		// 인터랙션 후 지정된 시간만큼 대기
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(waitTime) // 의도된 동작일 수 있으므로 유지 (린트 규칙 비활성화)
		// 참고: 일반적으로는 locator.waitFor와 같은 명시적 대기를 권장합니다.
		// 예: await locator.waitFor({ state: 'visible', timeout: waitTime });
		// 하지만 모든 인터랙션 후 기다려야 할 특정 상태를 정의하기 어려움.

		// 페이지 에러가 발생했는지 확인
		if (pageErrorOccurred) {
			// 페이지 에러가 발생했지만 계속 진행하기 위해 에러 정보만 기록
			result.errorMessage = `페이지 에러 발생 (계속 진행): ${pageErrorMessage}`
			result.success = false // 페이지 에러 시 실패로 간주 (기존 로직 유지 시 주석 처리)
		}
		// else { // 페이지 에러가 없을 때만 성공 처리하던 기존 로직 -> 페이지 에러 있어도 성공으로 간주하던 로직 수정
		//  result.success = true;
		//}
	} catch (error) {
		// 에러 정보 기록
		result.errorMessage = error.message
		result.errorStack = error.stack
		result.error = error // 원본 에러 객체도 보존
		result.success = false // 에러 발생 시 명시적으로 실패 처리

		if (verbose) {
			console.error(
				`인터랙션 실행 중 오류 발생 (${interaction.type} on (${interaction.selector})): ${error.message}`,
			)
		}
	} finally {
		// 항상 이벤트 리스너 제거
		page.removeListener('pageerror', pageErrorHandler)
	}

	return result // 항상 결과 객체 반환, 호출자가 성공/실패 처리
}

/**
 * 인터랙션 타입에 따라 적절한 실행 함수 호출 executeInteraction의 복잡도를 줄이기 위해 분리
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Interaction} interaction - 실행할 인터랙션
 * @param {InteractionResult} result - 결과를 저장할 객체
 */
async function executeInteractionByType(page, interaction, result) {
	try {
		switch (interaction.type) {
			case 'click': {
				await page.click(interaction.selector, { timeout: 5000 }) // 타임아웃 추가
				result.message = '클릭'
				break
			}
			case 'drag': {
				await page.hover(interaction.selector)
				await page.dragAndDrop(interaction.selector, interaction.selector, {
					targetPosition: { x: 10, y: 10 },
					timeout: 5000, // 타임아웃 추가
				})
				result.message = '드래그'
				break
			}
			case 'fill': {
				await executeFillInteraction(page, interaction, result)
				break
			}
			case 'hover': {
				await page.hover(interaction.selector, { timeout: 5000 }) // 타임아웃 추가
				result.message = '호버'
				break
			}
			case 'select': {
				await executeSelectInteraction(page, interaction, result)
				break
			}
			case 'setRange': {
				await executeRangeInteraction(page, interaction, result)
				break
			}
			default: {
				result.errorMessage = `지원하지 않는 인터랙션 타입: ${interaction.type}`
				result.success = false
				return // 지원하지 않는 타입이면 에러 정보 기록 후 리턴
			}
		}
	} catch (error) {
		// 에러 정보 기록만 하고 throw 하지 않음
		// eslint-disable-next-line require-atomic-updates
		result.errorMessage = error.message
		// eslint-disable-next-line require-atomic-updates
		result.errorStack = error.stack
		// eslint-disable-next-line require-atomic-updates
		result.error = error
		// eslint-disable-next-line require-atomic-updates
		result.success = false
		console.error(
			`인터랙션 실행 중 에러 발생 <${interaction.type}> on (${interaction.selector})): ${error.message}`,
		)
		// 에러를 throw하지 않고 처리 완료
	}

	// eslint-disable-next-line require-atomic-updates
	result.success = true
}

/** Fill 인터랙션 실행 */
async function executeFillInteraction(page, interaction, result) {
	// interaction 객체에 이미 value가 포함되어 있는지 확인
	if (interaction.value === undefined) {
		// 필드 타입에 따라 적절한 테스트 값 생성 - legacy 지원 (이전 버전 호환성)
		const valueType = interaction.valueType || 'text'
		const value = getRandomValueForType(valueType)
		await page.fill(interaction.selector, value)
		result.value = value
		result.message = `값 입력: ${value}`
	} else {
		// fc에서 생성된 값(문자열) 사용
		await page.fill(interaction.selector, interaction.value)
		result.value = interaction.value
		result.message = `값 입력: ${interaction.value}`
	}

	result.success = true
}

/** Select 인터랙션 실행 */
async function executeSelectInteraction(page, interaction, result) {
	if (interaction.value !== undefined) {
		// fc에서 생성된 값 사용
		await page.selectOption(interaction.selector, interaction.value)
		result.value = interaction.value
		result.message = `옵션 선택: ${interaction.value}`
		result.success = true
	} else if (interaction.options && interaction.options.length > 0) {
		// legacy 지원 - 랜덤하게 옵션 선택 (이전 버전 호환성)
		const randomIndex = getRandom(0, interaction.options.length - 1)
		const selectedValue = interaction.options[randomIndex]
		await page.selectOption(interaction.selector, selectedValue)
		result.value = selectedValue
		result.message = `옵션 선택: ${selectedValue}`
		result.success = true
	} else {
		result.errorMessage = '선택 가능한 옵션이 없음'
		result.success = false
	}
}

/** Range 인터랙션 실행 */
async function executeRangeInteraction(page, interaction, result) {
	const min = interaction.min || 0
	const max = interaction.max || 100

	// interaction.value가 있으면 사용, 없으면 legacy 지원으로 값 생성
	const newValue = interaction.value === undefined ? getRandom(min, max) : interaction.value

	// locator.evaluate를 사용하여 범위 값 설정 및 이벤트 발생
	const locator = page.locator(interaction.selector)
	await locator.evaluate(
		(el, val) => {
			// el은 이미 선택된 요소이므로 타입 체크만 수행
			if (el instanceof HTMLInputElement && (el.type === 'range' || el.type === 'number')) {
				// Input 요소의 value 속성을 직접 설정하는 것이 더 안정적일 수 있음
				el.value = String(val)
				// setAttribute를 사용해야 하는 경우
				// el.setAttribute('value', String(val));
			}
			// 값 변경 후 이벤트 발생시켜 변경을 감지하도록 함
			el.dispatchEvent(new Event('input', { bubbles: true }))
			el.dispatchEvent(new Event('change', { bubbles: true }))
		},
		newValue, // evaluate 함수의 두 번째 인자로 전달
	)
	result.value = newValue
	result.message = `범위 값 설정: ${newValue}`
	result.success = true
}

/**
 * 인터랙션 시퀀스 생성을 위한 fast-check arbitrary 생성 fast-check 라이브러리를 사용해 무작위 인터랙션 시퀀스를 생성합니다.
 *
 * @param {Interaction[]} interactions - 가능한 인터랙션 목록
 * @param {number} length - 시퀀스 길이
 * @returns {fc.Arbitrary<Interaction[]>} 인터랙션 시퀀스 arbitrary
 */
function createInteractionSequenceArbitrary(interactions, length) {
	if (interactions.length === 0) {
		return fc.constant([])
	}

	// 1단계: 인터랙션 타입별 분류
	const fillInteractions = interactions.filter((i) => i.type === 'fill')
	const clickInteractions = interactions.filter((i) => i.type === 'click')
	const hoverInteractions = interactions.filter((i) => i.type === 'hover')
	const selectInteractions = interactions.filter((i) => i.type === 'select')
	const rangeInteractions = interactions.filter((i) => i.type === 'setRange')
	const dragInteractions = interactions.filter((i) => i.type === 'drag')

	// 2단계: 구조화된 Arbitrary 생성
	const arbitraries = []

	// 클릭 인터랙션 처리 - fc.nat() 사용하여 shrink 가능하게 변경
	if (clickInteractions.length > 0) {
		const clickInteractionArb = fc
			.record({
				type: fc.constant('click'),
				// 인덱스를 사용하여 축소 가능하도록 변경
				selectorIndex: fc.nat({ max: clickInteractions.length - 1 }),
			})
			.map(
				// 원본 데이터로 변환
				({ type, selectorIndex }) => ({
					...clickInteractions[selectorIndex],
					type,
				}),
			)
		arbitraries.push(clickInteractionArb)
	}

	// 호버 인터랙션 처리 - fc.nat() 사용하여 shrink 가능하게 변경
	if (hoverInteractions.length > 0) {
		const hoverInteractionArb = fc
			.record({
				type: fc.constant('hover'),
				// 인덱스를 사용하여 축소 가능하도록 변경
				selectorIndex: fc.nat({ max: hoverInteractions.length - 1 }),
			})
			.map(
				// 원본 데이터로 변환
				({ type, selectorIndex }) => ({
					...hoverInteractions[selectorIndex],
					type,
				}),
			)
		arbitraries.push(hoverInteractionArb)
	}

	// 드래그 인터랙션 처리 - fc.nat() 사용하여 shrink 가능하게 변경
	if (dragInteractions.length > 0) {
		const dragInteractionArb = fc
			.record({
				type: fc.constant('drag'),
				// 인덱스를 사용하여 축소 가능하도록 변경
				selectorIndex: fc.nat({ max: dragInteractions.length - 1 }),
			})
			.map(
				// 원본 데이터로 변환
				({ type, selectorIndex }) => ({
					...dragInteractions[selectorIndex],
					type,
				}),
			)
		arbitraries.push(dragInteractionArb)
	}

	// 필 인터랙션 처리 - Shrinking 가능한 값 생성 포함
	if (fillInteractions.length > 0) {
		// 각 fill 인터랙션에 대해 개별 Arbitrary 생성
		for (let i = 0; i < fillInteractions.length; i++) {
			const originalInteraction = fillInteractions[i]
			const valueType = originalInteraction.valueType || 'text'

			// 해당 valueType에 맞는 값 Arbitrary 생성
			const valueArb = _getValueArbitraryForType(valueType)

			// fc.tuple을 사용하여 인터랙션 정보와 값을 함께 생성
			const fillInteractionArb = fc
				.tuple(
					fc.constant(i), // 인터랙션 인덱스
					valueArb, // 값 Arbitrary (shrinking 대상)
				)
				.map(([index, value]) => ({
					...fillInteractions[index],
					type: 'fill',
					value, // fc가 생성한 값(shrinking 가능)
				}))

			arbitraries.push(fillInteractionArb)
		}
	}

	// 셀렉트 인터랙션 처리 - Shrinking 가능한 값 생성 포함
	if (selectInteractions.length > 0) {
		// 각 select 인터랙션에 대해 개별 Arbitrary 생성
		for (let i = 0; i < selectInteractions.length; i++) {
			const originalInteraction = selectInteractions[i]
			const options = originalInteraction.options || []

			// 옵션이 없으면 건너뜀
			if (options.length === 0) continue

			// 옵션 중에서 선택하는 값 Arbitrary 생성
			const valueArb = _getValueArbitraryForType('select', { options })

			// fc.tuple을 사용하여 인터랙션 정보와 값을 함께 생성
			const selectInteractionArb = fc
				.tuple(
					fc.constant(i), // 인터랙션 인덱스
					valueArb, // 값 Arbitrary (shrinking 대상)
				)
				.map(([index, value]) => ({
					...selectInteractions[index],
					type: 'select',
					value, // fc가 생성한 값(shrinking 가능)
				}))

			arbitraries.push(selectInteractionArb)
		}
	}

	// 범위 인터랙션 처리 - Shrinking 가능한 값 생성 포함
	if (rangeInteractions.length > 0) {
		// 각 range 인터랙션에 대해 개별 Arbitrary 생성
		for (let i = 0; i < rangeInteractions.length; i++) {
			const originalInteraction = rangeInteractions[i]
			const min = originalInteraction.min || 0
			const max = originalInteraction.max || 100

			// min과 max 사이의 값 Arbitrary 생성
			const valueArb = _getValueArbitraryForType('range', { min, max })

			// fc.tuple을 사용하여 인터랙션 정보와 값을 함께 생성
			const rangeInteractionArb = fc
				.tuple(
					fc.constant(i), // 인터랙션 인덱스
					valueArb, // 값 Arbitrary (shrinking 대상)
				)
				.map(([index, value]) => ({
					...rangeInteractions[index],
					type: 'setRange',
					value, // fc가 생성한 값(shrinking 가능)
				}))

			arbitraries.push(rangeInteractionArb)
		}
	}

	// 3단계: 최종 시퀀스 Arbitrary 생성
	const interactionArb = fc.oneof(...arbitraries)

	// 배열 길이와 요소가 자동으로 축소되도록 함
	// 최소 길이를 1로 설정하여 개별 상호작용까지 축소 가능하도록 함
	return fc.array(interactionArb, {
		minLength: 1, // 여기를 0에서 1로 변경 - 최소 길이는 1이어야 함
		maxLength: interactions.length + length,
	})
}

/**
 * 컴포넌트 상태 검증 컴포넌트가 화면에 표시되는지 확인하고 기본 정보를 수집합니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {string} componentSelector - 컴포넌트의 최상위 셀렉터
 * @returns {Promise<{ isVisible: boolean; summary: string }>} 컴포넌트 상태 검증 결과
 */
async function verifyComponentState(page, componentSelector, timeout = 5000) {
	const locator = page.locator(componentSelector)
	let isVisible = false
	let summary = `컴포넌트(${componentSelector})가 지정된 시간(${timeout}ms) 내에 표시되지 않음`

	try {
		// 지정된 시간 동안 컴포넌트가 화면에 나타날 때까지 기다립니다.
		await locator.waitFor({ state: 'visible', timeout })
		isVisible = true // waitFor가 성공하면 컴포넌트가 보이는 것입니다.
	} catch (error) {
		// waitFor가 타임아웃되면 에러가 발생합니다. isVisible은 false로 유지됩니다.
		console.warn(`waitFor 중 오류 발생 또는 타임아웃 (${componentSelector}): ${error.message}`)
		// 요약 메시지는 이미 초기값으로 설정되어 있습니다.
	}

	// 컴포넌트가 보이는 경우에만 추가 정보 수집 시도
	if (isVisible) {
		try {
			// 로케이터를 사용하여 정보 수집
			const childCount = await locator.locator('> *').count() // 직계 자식 요소 수
			const classes = (await locator.getAttribute('class')) || 'none'
			const id = (await locator.getAttribute('id')) || 'none'
			summary = `컴포넌트 정보 - 자식 요소: ${childCount}개, 클래스: ${classes}, ID: ${id}`
		} catch (error) {
			// 정보 수집 중 오류 발생 시 (예: 요소가 갑자기 사라짐)
			console.warn(`상태 확인 중 오류 (${componentSelector}): ${error.message}`)
			summary = '컴포넌트 정보 수집 중 오류 발생'
			// isVisible은 true였지만, 정보 수집 중 문제가 발생했으므로 상태를 다시 확인하거나 false로 설정할 수 있습니다.
			// 여기서는 일단 isVisible=true 로 유지하고 요약 메시지만 변경합니다.
		}
	}

	return { isVisible, summary }
}

/**
 * 디버그 정보를 파일로 저장 - 강화된 예외 처리
 *
 * @param {string} dir - 저장할 디렉토리
 * @param {string} filename - 파일 이름
 * @param {object} data - 저장할 데이터
 * @returns {Promise<{ success: boolean; path?: string; error?: Error }>} 저장 결과
 */
async function saveDebugInfo(dir, filename, data) {
	try {
		// 디렉토리가 없으면 생성
		await fs.mkdir(dir, { recursive: true })
		const filePath = path.join(dir, filename)

		// JSON 형식으로 데이터 저장
		await fs.writeFile(filePath, JSON.stringify(data, undefined, 2), 'utf8')
		return { success: true, path: filePath }
	} catch (error) {
		console.error(`디버그 정보 저장 실패: ${error.message}`)
		// 실패해도 테스트 진행에 영향을 주지 않도록 에러 객체와 함께 실패 정보만 반환
		return { success: false, error }
	}
}

/**
 * 현재 시간을 파일명으로 사용하기 좋은 형식으로 반환 파일 이름에 사용할 수 없는 문자를 제거한 타임스탬프를 생성합니다.
 *
 * @returns {string} 포맷된 시간 문자열 (예: '2023-04-25T14-30-22')
 */
function getTimestamp() {
	// ISO 형식의 시간에서 파일명에 사용할 수 없는 콜론(:)을 대시(-)로 변경
	return new Date().toISOString().replaceAll(':', '-').replace(/\..+/, '')
}

/**
 * 컴포넌트 이름 추출 (URL에서) Storybook URL에서 컴포넌트 이름을 추출합니다.
 *
 * @param {string} url - 페이지 URL
 * @returns {string} 컴포넌트 이름
 */
function extractComponentName(url) {
	try {
		// URL 파싱
		const urlObj = new URL(url, 'http://localhost')
		// id 쿼리 파라미터 추출 (새로운 URL 형식에서는 id 파라미터에 컴포넌트 이름이 있음)
		const id = urlObj.searchParams.get('id') || ''

		if (!id) return 'unknown-component'

		return id.replaceAll('--', '@')
	} catch {
		return 'unknown-component'
	}
}

function pushAndConsoleError(logArray, message) {
	logArray.push(message)
	console.error(message)
}

function logShrunkSequence(checkResult) {
	const logArray = []
	const logPush = R.curry(pushAndConsoleError)(logArray)

	const counterExample = checkResult.counterexample

	// 이제 직접 배열로 받아옴 (객체의 sequence 속성이 아님)
	const shrunkSequence = counterExample[0]

	console.log('checkResult:', checkResult)

	logPush('----------- 축소된 실패 케이스  -----------')

	// 핵심 인터랙션 식별
	if (shrunkSequence.length === 1) {
		const interactionValue = shrunkSequence[0].value ? `: ${shrunkSequence[0].value}` : ''
		const interactionString = `${shrunkSequence[0].type}${interactionValue}`
		logPush(`- <${interactionString}> on (${shrunkSequence[0].selector})`)
	} else {
		for (const [i, interaction] of shrunkSequence.entries()) {
			const interactionValue = interaction.value ? `: ${interaction.value}` : ''
			const interactionString = `${interaction.type}${interactionValue}`
			logPush(`${i + 1}. <${interactionString}> on (${interaction.selector})`)
		}
	}
	return logArray
}

/**
 * 축소된 반례를 사용하여 단계별 디버깅 수행
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Interaction[]} shrunkSequence - 축소된 인터랙션 시퀀스
 * @param {string} componentSelector - 컴포넌트 셀렉터
 * @param {number} waitTime - 대기 시간
 */
async function debugWithShrunkExample(page, shrunkSequence, componentSelector, waitTime) {
	const logArray = []
	const logPush = R.curry(pushAndConsoleError)(logArray)

	logPush('----------- 축소된 실패 케이스 디버깅 시작 -----------')

	// 페이지가 닫혔는지 확인
	if (await isPageClosed(page)) {
		logPush('디버깅을 시작하려 했으나 페이지가 이미 닫혀 있습니다.')
		logPush('----------- 축소된 반례 디버깅 완료 (페이지 닫힘) -----------')
		return logArray
	}

	// 컴포넌트 상태 초기화
	try {
		await resetComponentState(page)
	} catch (error) {
		logPush(`컴포넌트 상태 초기화 중 오류 발생: ${error.message}`)
		// 초기화 실패해도 계속 진행
	}

	// 페이지 에러와 콘솔 에러를 감지하기 위한 변수들
	let pageErrors = []
	let consoleErrors = []

	// 단계 추적용 객체
	/** @type {StepTracker} */
	const stepTracker = {
		currentStep: undefined,
		currentInteraction: undefined,
	}

	// 페이지 에러 이벤트 리스너 등록 - 각 인터랙션과 에러 연결 강화
	const pageErrorHandler = (error) => {
		// @ts-ignore - 타입 호환성 오류 무시 (개선 필요)
		const errorInfo = {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
			currentStep: stepTracker.currentStep,
			currentInteraction: stepTracker.currentInteraction,
		}
		pageErrors.push(errorInfo)
		logPush(`페이지 에러 감지: ${error.message}`)
		if (stepTracker.currentStep !== undefined) {
			logPush(`관련 인터랙션 단계: ${stepTracker.currentStep}`)
		}
	}

	// 콘솔 에러 이벤트 리스너 등록
	const consoleErrorHandler = (msg) => {
		if (msg.type() === 'error') {
			// @ts-ignore - 타입 호환성 오류 무시 (개선 필요)
			const errorInfo = {
				message: msg.text(),
				timestamp: new Date().toISOString(),
				currentStep: stepTracker.currentStep,
				currentInteraction: stepTracker.currentInteraction,
			}
			consoleErrors.push(errorInfo)
			logPush(`콘솔 에러 감지: ${msg.text()}`)
			if (stepTracker.currentStep !== undefined) {
				logPush(`관련 인터랙션 단계: ${stepTracker.currentStep}`)
			}
		}
	}

	// 이벤트 리스너 등록
	try {
		page.on('pageerror', pageErrorHandler)
		page.on('console', consoleErrorHandler)
	} catch (error) {
		logPush(`이벤트 리스너 등록 중 오류 발생: ${error.message}`)
		// 등록 실패해도 계속 진행
	}

	try {
		// 각 인터랙션 단계별 실행 및 상태 확인
		for (let i = 0; i < shrunkSequence.length; i++) {
			// 페이지가 닫혔는지 매 반복마다 확인
			if (await isPageClosed(page)) {
				logPush(`${i + 1} 단계 실행 전 페이지가 닫혀 있습니다. 디버깅을 중단합니다.`)
				break
			}

			// 현재 단계 정보 설정
			stepTracker.currentStep = i + 1
			stepTracker.currentInteraction = shrunkSequence[i]
			const interactionValue = shrunkSequence[i].value ? `: ${shrunkSequence[i].value}` : ''
			const interactionString = `${shrunkSequence[i].type}${interactionValue}`

			logPush(
				`${i + 1}/${shrunkSequence.length}: <${interactionString}> on (${shrunkSequence[i].selector})`,
			)

			// 이전 에러들 초기화
			pageErrors = []
			consoleErrors = []

			try {
				// 인터랙션 실행
				const result = await executeInteraction(page, shrunkSequence[i], waitTime, true)
				logPush(`[ ${i + 1} 단계 인터랙션 실행: <${result.message}> ]`)

				// 페이지가 닫혔는지 다시 확인
				if (await isPageClosed(page)) {
					logPush(`${i + 1} 단계 실행 후 페이지가 닫혔습니다. 디버깅을 중단합니다.`)
					break
				}

				// 인터랙션 후 페이지 에러 확인 - shrinking을 위한 중요 지점
				if (consoleErrors.length > 0 || pageErrors.length > 0) {
					// 에러가 감지되었음을 보고
					logPush(`< ${i + 1} 단계 실행 후 에러 발생: <${result.message}> >`)
					break
				}

				// 컴포넌트 상태 확인
				try {
					const stateCheck = await verifyComponentState(page, componentSelector)
					logPush(`상태: ${stateCheck.isVisible ? 'visible' : 'invisible'} - ${stateCheck.summary}`)
				} catch (stateError) {
					logPush(`상태 확인 중 오류 발생: ${stateError.message}`)
					// 상태 확인 실패해도 계속 진행
				}
			} catch (error) {
				// 인터랙션 실행 중 발생한 에러를 로깅하고 계속 진행
				logPush(`< ${i + 1} 단계 실행 중 에러 발생: ${error.message} >`)
				logPush(`에러 스택: ${error.stack?.split('\n')[0] || 'N/A'}`)

				// 페이지가 닫혔는지 확인
				if (await isPageClosed(page)) {
					logPush(`에러 발생 후 페이지가 닫혔습니다. 디버깅을 중단합니다.`)
					break
				}

				break
			}
		}
	} catch (error) {
		// 예상치 못한 에러가 발생해도 로깅만 하고 정상 종료
		logPush(`디버깅 중 예상치 못한 에러 발생: ${error.message}`)
		logPush(`에러 스택: ${error.stack || 'N/A'}`)
	} finally {
		// 단계 추적 정보 초기화
		stepTracker.currentStep = undefined
		stepTracker.currentInteraction = undefined

		// 페이지가 열려있을 때만 이벤트 리스너 제거 시도
		if (await isPageClosed(page)) {
			logPush('페이지가 닫혀 있어 이벤트 리스너를 제거하지 않습니다.')
		} else {
			try {
				page.removeListener('pageerror', pageErrorHandler)
				page.removeListener('console', consoleErrorHandler)
				logPush('이벤트 리스너가 성공적으로 제거되었습니다.')
			} catch (error) {
				logPush(`이벤트 리스너 제거 중 오류 발생: ${error.message}`)
			}
		}
	}
	return logArray
}

/**
 * 페이지가 닫혔는지 확인하는 헬퍼 함수 추가
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<boolean>} 페이지가 닫혔는지 여부
 */
async function isPageClosed(page) {
	try {
		// 페이지가 닫혔는지 간단한 연산으로 확인 (evaluate 사용 불가피)
		// 페이지가 닫혔다면 예외가 발생함

		await page.evaluate('1 + 1')
		return false // 예외가 발생하지 않으면 페이지가 열려 있음
	} catch (error) {
		// Playwright 최신 버전에서는 에러 메시지가 다를 수 있음
		return (
			error.message.includes('Target page, context or browser has been closed') ||
			error.message.includes('Target closed') || // 이전 버전 호환성
			error.message.includes('Protocol error') // 일반적인 연결 오류
		)
	}
}

/**
 * 단일 반복 테스트를 실행하는 헬퍼 함수
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {number} iteration - 현재 반복 횟수 인덱스
 * @param {object} config - 테스트 설정
 * @returns {Promise<iterationInfo>} 반복 실행 결과
 */
async function runSingleIteration(page, iteration, errors, config) {
	const {
		sequenceLength = 5,
		numRuns = 10,
		componentSelector = '#storybook-root',
		waitAfterInteraction = 100,
		verbose = false,
	} = config

	if (config.verbose) {
		console.log(`\n[${iteration + 1}/${config.iterationCount}] 인터랙션 시퀀스 반복 시작`)
	}

	/** @type {IterationInfo} */
	const iterationInfo = {
		iterationNumber: iteration + 1,
		sequences: [],
		errors,
		startTime: new Date().toISOString(),
		success: false, // 초기값은 false로 설정
		failureInfo: undefined,
	}

	// Todos: shrink와 어떻게 조화?
	// if (resetComponent) { 주석 해제하지말것
	try {
		await resetComponentState(page)
	} catch (error) {
		console.error(`컴포넌트 상태 초기화 중 오류 발생: ${error.message}`)
		// 초기화 실패해도 계속 진행
	}
	// }

	// 페이지가 닫혔는지 확인
	if (await isPageClosed(page)) {
		console.error('페이지가 이미 닫혀 있습니다. 이번 반복은 중단합니다.')
		iterationInfo.success = false
		iterationInfo.errors = [
			...errors,
			{ message: '페이지가 이미 닫혀 있음', stack: new Error('페이지가 이미 닫혀 있음').stack },
		]
		return iterationInfo
	}

	// 인터랙티브 요소 탐색하여 가능한 인터랙션 목록 가져오기
	let interactions = []
	try {
		interactions = await discoverInteractions(page, componentSelector)
		if (config.verbose) {
			console.log(`발견된 인터랙션 수: ${interactions.length}`)
		}
	} catch (error) {
		console.error(`인터랙션 탐색 중 오류 발생: ${error.message}`)
		if (await isPageClosed(page)) {
			console.error('페이지가 닫혀 있습니다. 이번 반복은 중단합니다.')
			iterationInfo.success = false
			iterationInfo.errors = [
				...errors,
				{ message: `페이지가 닫힘: ${error.message}`, stack: error.stack },
			]
			return iterationInfo
		}
	}

	// 인터랙티브 요소가 없으면 기본 렌더링 상태만 확인하고 계속 진행
	if (interactions.length === 0) {
		if (config.verbose) {
			console.log('인터랙티브 요소 발견되지 않음. 기본 렌더링 상태 확인.')
		}

		try {
			const stateCheck = await verifyComponentState(page, componentSelector)
			iterationInfo.stateSummary = stateCheck.summary
			iterationInfo.noInteractions = true
			iterationInfo.success = stateCheck.isVisible // 컴포넌트가 보이면 성공으로 간주
		} catch (error) {
			console.error(`상태 확인 중 오류 발생: ${error.message}`)
			iterationInfo.success = false
			iterationInfo.errors = [...errors, { message: error.message, stack: error.stack }]
		}
		return iterationInfo
	}

	// 인터랙션 시퀀스 생성을 위한 arbitrary 생성
	const sequenceArb = createInteractionSequenceArbitrary(interactions, sequenceLength)
	let checkResult

	// 페이지 에러 발생 시에도 테스트를 계속 진행하기 위한 pageError 핸들러 설정
	const pageErrors = []
	const pageErrorHandler = (error) => {
		pageErrors.push({
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
		})
		// 로그만 남기고 테스트는 계속 진행
		console.error(`페이지 에러 감지 (테스트 계속 진행): ${error.message}`)
	}

	// 페이지 에러 핸들러 등록
	page.on('pageerror', pageErrorHandler)

	try {
		// fast-check 실행
		checkResult = await fc.check(
			fc.asyncProperty(sequenceArb, async (sequence) => {
				// 페이지가 닫혔는지 확인
				if (await isPageClosed(page)) {
					console.error('페이지가 닫혀 있습니다. 시퀀스 실행을 중단합니다.')
					throw new Error('페이지가 닫혀 있어 시퀀스를 실행할 수 없습니다.')
				}

				// 시퀀스 정보 초기화 - 명시적 타입 지정
				/** @type {SequenceInfo} */
				const sequenceInfo = {
					results: [],
					errors: [],
					startTime: new Date().toISOString(),
				}

				// 현재 시퀀스 실행 중 발생한 페이지 에러를 추적하기 위한 변수
				let sequencePageErrors = []

				// 시퀀스 실행 중 페이지 에러를 감지하기 위한 이벤트 핸들러
				const sequenceErrorHandler = (error) => {
					sequencePageErrors.push({
						message: error.message,
						stack: error.stack,
						timestamp: new Date().toISOString(),
					})
					console.error(`시퀀스 실행 중 페이지 에러 감지: ${error.message}`)
				}

				// 시퀀스별 에러 핸들러 등록
				page.on('pageerror', sequenceErrorHandler)

				if (config.verbose) {
					console.log(`시퀀스 실행 (${sequence.length}개 인터랙션)`)
				}

				let returnValue = true
				try {
					// 시퀀스의 각 인터랙션 차례로 실행 (for-of 대신 인덱스 기반 루프 사용)
					for (const [i, interaction] of sequence.entries()) {
						// 각 인터랙션마다 페이지가 닫혔는지 확인
						if (await isPageClosed(page)) {
							console.error(`인터랙션 #${i} (${interaction.type}) 실행 전 페이지가 닫혀 있습니다.`)
							throw new Error(
								`인터랙션 #${i} (${interaction.type}) 실행 전 페이지가 닫혀 있습니다.`,
							)
						}

						const result = await executeInteraction(
							page,
							interaction,
							waitAfterInteraction,
							verbose,
						)
						// @ts-ignore - 타입 호환성 오류 무시
						sequenceInfo.results.push(result)

						// 인터랙션이 실패했을 경우 처리 - 인덱스 정보 추가
						if (!result.success) {
							if (result.errorMessage) {
								errors.push({
									message: result.errorMessage,
									stack: result.errorStack,
									interactionIndex: i, // 인덱스 정보 추가
								})
								// @ts-ignore - 타입 호환성 오류 무시
								sequenceInfo.errors.push({
									message: result.errorMessage,
									stack: result.errorStack,
									interactionIndex: i, // 인덱스 정보 추가
								})
							}
							// 인덱스가 포함된 에러 메시지로 변경
							throw new Error(
								`인터랙션 #${i} (${interaction.type} on (${interaction.selector})) 실행 실패: ${result.errorMessage || '알 수 없는 오류'}`,
							)
						}

						// 인터랙션 후 페이지 에러 확인 - shrinking을 위한 중요 지점
						if (sequencePageErrors.length > 0) {
							// 인터랙션 실행 중 페이지 에러가 발생한 경우 시퀀스를 실패로 표시
							// @ts-ignore - 타입 호환성 오류 무시
							sequenceInfo.errors.push(
								...sequencePageErrors.map((err) => ({
									message: `인터랙션 #${i} 실행 중 페이지 에러: ${err.message}`,
									stack: err.stack,
									interactionIndex: i, // 인덱스 정보 추가
								})),
							)

							// 인덱스가 포함된 에러 메시지로 변경
							throw new Error(
								`인터랙션 #${i} (${interaction.type} on (${interaction.selector})) 실행 중 페이지 에러 발생: ${sequencePageErrors[0].message}`,
							)
						}
					}

					// 페이지가 닫혔는지 확인 후 상태 검증
					if (await isPageClosed(page)) {
						console.error('상태 검증 전 페이지가 닫혀 있습니다.')
						throw new Error('상태 검증 전 페이지가 닫혀 있습니다.')
					}

					// 시퀀스 실행 후 컴포넌트 상태 검증
					const stateCheck = await verifyComponentState(page, componentSelector)
					sequenceInfo.finalState = stateCheck.summary
					sequenceInfo.endTime = new Date().toISOString()
					iterationInfo.sequences.push(sequenceInfo)
				} catch (error) {
					// 예상치 못한 에러 발생 시 처리
					errors.push({
						message: error.message,
						stack: error.stack,
					})

					sequenceInfo.endTime = new Date().toISOString()
					iterationInfo.sequences.push(sequenceInfo)

					// 에러 발생해도 fc.check는 계속 진행
					throw error
				} finally {
					// 시퀀스별 에러 핸들러 제거
					page.removeListener('pageerror', sequenceErrorHandler)

					// 시퀀스 정보에 발생한 에러 추가
					if (sequencePageErrors.length > 0) {
						// @ts-ignore - 타입 호환성 오류 무시
						sequenceInfo.errors.push(
							...sequencePageErrors.map((err) => ({
								message: `페이지 에러: ${err.message}`,
								stack: err.stack,
							})),
						)
					}
				}

				return returnValue
			}),
			{
				numRuns,
				verbose: 2,
				// 즉시 실패 시 shrinking을 시작하여 불필요한 인터랙션 제거 진행
				endOnFailure: false,
				// 더 적극적인 shrinking 수행을 위해 설정 조정
				maxSkipsPerRun: 1000,
			},
		)

		// 테스트 결과에 따라 success 설정
		iterationInfo.success = !checkResult?.failed

		if (checkResult?.failed) {
			// 테스트 실패 - 축소된 반례 활용
			// fast-check의 반례가 있는지 확인
			if (checkResult.counterexample && checkResult.counterexample.length > 0) {
				console.log('💬 runSingleIteration checkResult:', checkResult)
				console.log('💬 runSingleIteration counterexample:', checkResult.counterexample)

				// shrinking 후 발견된 최소 반례
				const shrunkValue = /** @type {Interaction[]} */ (checkResult?.counterexample[0])

				// 반례 분석 (타입 확인하여 호출)
				const logArray1 = logShrunkSequence(checkResult)

				// failureInfo 타입을 맞춰서 설정
				iterationInfo.failureInfo = {
					counterExample: shrunkValue,
					error: {
						message: 'Property failed',
						stack: checkResult.failed ? 'Fast-check 속성 검증 실패' : '',
					},
					property: 'Component interaction sequence',
				}

				// 페이지가 닫혔는지 확인 후 디버깅 수행
				const isPageAlreadyClosed = await isPageClosed(page)
				if (isPageAlreadyClosed) {
					console.error('축소된 반례 디버깅을 시작하려 했으나 페이지가 이미 닫혀 있습니다.')
				} else {
					// 페이지가 열려있을 때만 디버깅 수행
					let logArray2 = []
					try {
						logArray2 = await debugWithShrunkExample(
							page,
							shrunkValue,
							componentSelector,
							waitAfterInteraction,
						)
					} catch (debugError) {
						console.error(`축소된 반례 디버깅 중 오류 발생: ${debugError.message}`)
					}
					test.info().attach('시퀀스 디버깅 로그', {
						body: `${logArray1.join('\n')}\n${logArray2.join('\n')}`,
					})
				}
			} else {
				console.error('반례를 찾을 수 없습니다')
			}
		}
	} catch (fcError) {
		// fast-check 자체 에러 발생 시
		console.error('--------------------------------')
		console.error('Fast-check 테스트 실패:', fcError)

		if (fcError.counterexample) {
			const counterExample = fcError.counterexample
			console.error(`반례 발견: ${JSON.stringify(counterExample, undefined, 2)}`)

			// 반례가 있으면 분석해보기
			if (Array.isArray(counterExample) && counterExample.length > 0) {
				console.log('counterExample', counterExample)
				const shrunkValue = /** @type {Interaction[]} */ (counterExample[0])
				if (Array.isArray(shrunkValue)) {
					logShrunkSequence(counterExample)

					iterationInfo.failureInfo = {
						counterExample: shrunkValue,
						error: { message: fcError.message, stack: fcError.stack },
						property: fcError.property?.toString(),
					}

					// 페이지가 닫히지 않았을 때만 디버깅 시도
					const isPageAlreadyClosed = await isPageClosed(page)
					if (isPageAlreadyClosed) {
						console.error('축소된 반례 디버깅을 시작하려 했으나 페이지가 이미 닫혀 있습니다.')
					} else {
						try {
							await debugWithShrunkExample(
								page,
								shrunkValue,
								componentSelector,
								waitAfterInteraction,
							)
						} catch (debugError) {
							console.error(`축소된 반례 디버깅 중 오류 발생: ${debugError.message}`)
						}
					}
				}
			}
		}

		for (const error of errors) {
			console.error('- Error:', error)
		}
		console.error('--------------------------------')
		iterationInfo.success = false
	} finally {
		// 페이지 에러 핸들러 제거
		page.removeListener('pageerror', pageErrorHandler)

		// 수집된 페이지 에러를 errors 배열에 추가
		errors.push(
			...pageErrors.map((err) => ({
				message: `페이지 에러: ${err.message}`,
				stack: err.stack,
				timestamp: err.timestamp,
			})),
		)
	}
	return iterationInfo
}

/**
 * UI 컴포넌트에 대한 범용 property-based 테스트 실행 (고급 디버깅 개선 버전) 이 함수는 전체 테스트 프로세스를 실행하는 메인 함수입니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {TestConfig} config - 테스트 설정
 * @returns {Promise<Object>} 테스트 결과 객체
 */
async function testUIComponent(page, config = {}) {
	// 기본 설정값과 사용자 정의 설정 병합
	const {
		iterationCount = 3, // 테스트 반복 횟수
		debugLogDir = './test-results/debug-logs', // 디버그 로그 저장 경로
	} = config

	const componentName = extractComponentName(page.url())
	// 디버그 정보 초기화
	/** @type {DebugInfo} */
	const debugInfo = {
		timestamp: getTimestamp(),
		componentName,
		url: page.url(),
		testConfig: config,
		iterations: [],
		errors: [],
		success: true,
	}
	let errors = []
	let isSuccessful = false

	// 페이지 오류 및 콘솔 오류 핸들러 설정 - 인터랙션과 에러 연결
	const errorHandler = (exception) => {
		const associatedInteractionMessage = `관련 인터랙션: ${currentInteraction.type} on (${currentInteraction.selector})`

		const errorInfo = {
			message: `페이지 에러: ${exception.message}`,
			stack: exception.stack,
			associatedInteraction: currentInteraction ? { ...currentInteraction } : undefined,
			associatedInteractionMessage,
			timestamp: new Date().toISOString(),
		}
		errors.push(errorInfo)

		// 인터랙션 정보가 있을 경우 로그에 표시
		if (currentInteraction) {
			console.error(`페이지 에러 발생: ${exception.message}`)
			console.error(associatedInteractionMessage)
		}
	}

	const consoleErrorHandler = (msg) => {
		if (msg.type() === 'error') {
			const errorInfo = {
				message: `콘솔 에러: ${msg.text()}`,
				associatedInteraction: currentInteraction ? { ...currentInteraction } : undefined,
				timestamp: new Date().toISOString(),
			}
			errors.push(errorInfo)

			// 인터랙션 정보가 있을 경우 로그에 표시
			if (currentInteraction) {
				console.error(`콘솔 에러 발생: ${msg.text()}`)
				console.error(
					`관련 인터랙션: ${currentInteraction.type} on (${currentInteraction.selector})`,
				)
			}
		}
	}

	page.on('pageerror', errorHandler)
	page.on('console', consoleErrorHandler)

	try {
		// 설정된 반복 횟수만큼 테스트 실행
		for (let iteration = 0; iteration < iterationCount; iteration++) {
			const iterationInfo = await runSingleIteration(page, iteration, errors, config)

			debugInfo.iterations.push(iterationInfo)
			isSuccessful = debugInfo.success

			if (errors.length > 0) {
				console.warn(`${componentName} - 반복#${iteration + 1}: 에러 발생`)
				console.warn(`발생한 에러: ${errors.map((e) => e.message).join(' / ')}`)
				// 테스트 실패 상태 기록
				isSuccessful = false
				debugInfo.success = false

				break
			}
		}
	} catch (error) {
		// 예기치 않은 오류 처리
		console.error('테스트 진행 중 오류 발생:', error)
		isSuccessful = false
		debugInfo.success = isSuccessful
		debugInfo.errors.push({
			message: error.message,
			stack: error.stack,
		})
	} finally {
		// 이벤트 리스너 제거
		page.removeListener('pageerror', errorHandler)
		page.removeListener('console', consoleErrorHandler)
	}

	// 디버그 정보 최종 업데이트 및 저장
	debugInfo.success = isSuccessful
	debugInfo.errors = debugInfo.errors.concat(errors)

	if (!isSuccessful) {
		// 디버그 정보 파일 저장
		const debugFilename = `test-${debugInfo.componentName}-${debugInfo.timestamp}.json`
		const saveResult = await saveDebugInfo(debugLogDir, debugFilename, debugInfo)

		if (saveResult.success) {
			// eslint-disable-next-line require-atomic-updates
			debugInfo.debugFilePath = saveResult.path
			if (config.verbose) {
				console.log(`테스트 디버그 정보 저장: ${debugFilename}`)
			}
		}

		const latestTestFailureInfo = debugInfo.iterations.at(-1)?.failureInfo

		console.log('디버그용', {
			isSuccessful,
			latestTestFailureInfo,
			counterExample: latestTestFailureInfo?.counterExample,
			debugInfo,
		})

		// 이 시점에서 모든 디버깅 정보 수집과 로깅이 완료됨
		// 최종적으로 테스트 실패 처리
		// eslint-disable-next-line playwright/missing-playwright-await
		test.step(`${componentName}: 테스트 결과 확인`, async () => {
			expect(
				false,
				`테스트 실패: 에러 발생 - ${debugInfo.errors.map((e) => e.message).join(' / ')}`,
			).toBeTruthy()
		})
	}

	// 테스트 결과 반환
	return debugInfo
}

// 외부에서 사용할 함수들 내보내기
// 이 라이브러리의 핵심 기능들을 다른 모듈에서 가져다 쓸 수 있도록 내보냅니다.
export {
	discoverInteractions, // 인터랙티브 요소 탐색 및 인터랙션 수집
	executeInteraction, // 인터랙션 실행
	resetComponentState, // 컴포넌트 상태 초기화
	testUIComponent, // 메인 테스트 함수 (전체 테스트 프로세스 실행)
	verifyComponentState, // 컴포넌트 상태 검증
}
