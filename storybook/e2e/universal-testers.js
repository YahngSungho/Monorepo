/**
 * @file Storybook UI 컴포넌트에 대한 범용 테스트 유틸리티 - 고급 디버깅 개선 버전 모든 Presentational 컴포넌트에 적용 가능한 범용성을 목표로
 *   작성됨.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

import { errors, expect, test } from '@playwright/test'
import fc, { json } from 'fast-check'

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
 * @property {number | null} currentStep - 현재 실행 중인 단계 번호
 * @property {Interaction | null} currentInteraction - 현재 실행 중인 인터랙션
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
	const rootComponent = await page.$(componentSelector)
	if (!rootComponent) return []

	// 브라우저 컨텍스트 내에서 직접 요소 정보와 선택자를 추출
	const elementInfos = await page.evaluate(
		(componentSelector) => {
			// 브라우저 컨텍스트 내에서 getUniqueSelector 함수 재정의
			function getUniqueSelector(el, base) {
				let testId = el.getAttribute('data-testid')
				if (testId) {
					return `${base} [data-testid="${testId}"]` // data-testid 속성이 있으면 최우선 사용
				} else if (el.id) {
					return `${base} #${el.id}` // id가 있으면 두 번째 우선순위로 사용
				} else if (el.className && typeof el.className === 'string' && el.className.trim() !== '') {
					// 클래스 이름이 있으면 처리하여 선택자 생성
					let classes = el.className
						.split(' ')
						.filter((c) => {
							return c.trim()
						})
						.join('.')
					return `${base} .${classes}`
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
					disabled: el.hasAttribute('disabled'),
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
		},
		componentSelector, // getUniqueSelector 함수를 전달하는 대신 내부에서 재정의
	)

	// 각 요소에 대해 가시성 체크 및 인터랙션 생성
	const interactions = []
	for (const elementInfo of elementInfos) {
		const isVisible = await page.isVisible(elementInfo.selector)
		if (!isVisible) continue

		// 요소 정보를 기반으로 가능한 인터랙션 생성
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
// eslint-disable-next-line sonarjs/cognitive-complexity
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
		await page.evaluate(
			() => {
				if (typeof globalThis.resetComponentState === 'function') {
					globalThis.resetComponentState()
				}
				// 명시적으로 값을 반환하여 평가가 완료되었음을 확인
				return 'resetComponentState 완료'
			},
			{ timeout: 1000 },
		) // 1초 타임아웃 추가
	} catch (error) {
		console.warn('컴포넌트 상태 초기화 중 오류 발생:', error.message)
		// 오류가 발생해도 테스트는 계속 진행
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
 * 안전한 난수 생성을 위한 유틸리티 함수
 *
 * @param {number} min - 최소값 (포함)
 * @param {number} max - 최대값 (포함)
 * @returns {number} Min과 max 사이의 난수
 */
function getSecureRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 테스트용 랜덤 문자열을 생성합니다.
 *
 * @returns {string} 랜덤 문자열
 */
function getSecureRandomString() {
	return Math.random().toString(36).substring(2, 8)
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
		// 대상 요소가 존재하는지 확인
		const elementExists = (await page.$(interaction.selector)) !== null
		if (!elementExists) {
			const error = new Error(`요소가 페이지에 존재하지 않음: (${interaction.selector})`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result // 요소가 없을 경우 결과 객체 반환, 예외를 던지지 않음
		}

		// 요소의 상호작용 가능 상태 확인 (visible, enabled 등)
		const isVisible = await page.isVisible(interaction.selector)
		if (!isVisible) {
			const error = new Error(`요소가 화면에 표시되지 않음: (${interaction.selector})`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result
		}

		// 요소가 disabled 상태인지 확인 (버튼, 입력 필드 등에 적용)
		const isDisabled = await page.evaluate((selector) => {
			const element = document.querySelector(selector)
			if (!element) return false
			// disabled 속성이 있는지 확인 (HTMLInputElement, HTMLButtonElement 등에만 존재)
			return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
		}, interaction.selector)

		if (isDisabled) {
			const error = new Error(`요소가 비활성화됨: (${interaction.selector})`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result
		}

		// 인터랙션 타입에 따른 처리
		await executeInteractionByType(page, interaction, result)

		// 인터랙션 후 지정된 시간만큼 대기
		await page.waitForTimeout(waitTime)

		// 페이지 에러가 발생했는지 확인
		if (pageErrorOccurred) {
			// 페이지 에러가 발생했지만 계속 진행하기 위해 에러 정보만 기록
			result.errorMessage = `페이지 에러 발생 (계속 진행): ${pageErrorMessage}`
			result.success = false
		} else {
			result.success = true
		}
	} catch (error) {
		// 에러 정보 기록
		result.errorMessage = error.message
		result.errorStack = error.stack
		result.error = error // 원본 에러 객체도 보존

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
		result.success = true
	} catch (error) {
		// 에러 정보 기록만 하고 throw 하지 않음
		result.errorMessage = error.message
		result.errorStack = error.stack
		result.error = error
		result.success = false
		console.error(`인터랙션 실행 중 에러 발생 (${interaction.type}): ${error.message}`)
		// 에러를 throw하지 않고 처리 완료
	}
}

/** Fill 인터랙션 실행 */
async function executeFillInteraction(page, interaction, result) {
	// 생성된 값을 사용하거나 없으면 새로 생성
	let { value } = interaction
	if (value === undefined) {
		// 필드 타입에 따라 적절한 테스트 값 생성
		switch (interaction.valueType) {
			case 'email': {
				value = `test${getSecureRandomString()}@example.com`
				break
			}
			case 'number': {
				value = getSecureRandom(0, 100).toString()
				break
			}
			case 'textarea': {
				value = `테스트 텍스트 ${getSecureRandomString()}`
				break
			}
			default: {
				value = `테스트 입력 ${getSecureRandomString()}`
			}
		}
	}
	await page.fill(interaction.selector, value)
	result.value = value
	result.message = `값 입력: ${value}`
}

/** Select 인터랙션 실행 */
async function executeSelectInteraction(page, interaction, result) {
	if (interaction.value !== undefined) {
		// 생성된 값 사용
		await page.selectOption(interaction.selector, interaction.value)
		result.value = interaction.value
		result.message = `옵션 선택: ${interaction.value}`
	} else if (interaction.options && interaction.options.length > 0) {
		// 랜덤하게 옵션 선택
		const randomIndex = getSecureRandom(0, interaction.options.length - 1)
		const selectedValue = interaction.options[randomIndex]
		await page.selectOption(interaction.selector, selectedValue)
		result.value = selectedValue
		result.message = `옵션 선택: ${selectedValue}`
	} else {
		throw new Error('선택 가능한 옵션이 없음')
	}
}

/** Range 인터랙션 실행 */
async function executeRangeInteraction(page, interaction, result) {
	const min = interaction.min || 0
	const max = interaction.max || 100
	const newValue = interaction.value !== undefined ? interaction.value : getSecureRandom(min, max)

	// JavaScript 평가를 통해 범위 값 설정 및 이벤트 발생
	await page.$eval(
		interaction.selector,
		(el, val) => {
			// input 태그이고 범위 또는 숫자 타입인 경우 값 설정
			if (
				el.tagName === 'INPUT' &&
				el.hasAttribute('type') &&
				(el.getAttribute('type') === 'range' || el.getAttribute('type') === 'number')
			) {
				// setAttribute를 사용하여 value 설정
				el.setAttribute('value', String(val))
			}
			// 값 변경 후 이벤트 발생시켜 변경을 감지하도록 함
			el.dispatchEvent(new Event('input', { bubbles: true }))
			el.dispatchEvent(new Event('change', { bubbles: true }))
		},
		newValue,
	)
	result.value = newValue
	result.message = `범위 값 설정: ${newValue}`
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
				// unmapper 함수: 인터랙션 객체를 record 형태로 복원
				(interaction) => {
					// 타입 단언을 통해 타입 오류 해결
					const typedInteraction = /** @type {Interaction} */ (interaction)
					// selector를 기준으로 원래 인덱스 찾기
					const index = clickInteractions.findIndex((i) => i.selector === typedInteraction.selector)
					// 타입을 상수 문자열로 반환하여 타입 오류 해결
					return {
						type: 'click', // 상수 'click'으로 반환
						selectorIndex: index >= 0 ? index : 0,
					}
				},
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
				// unmapper 함수: 인터랙션 객체를 record 형태로 복원
				(interaction) => {
					// 타입 단언을 통해 타입 오류 해결
					const typedInteraction = /** @type {Interaction} */ (interaction)
					// selector를 기준으로 원래 인덱스 찾기
					const index = hoverInteractions.findIndex((i) => i.selector === typedInteraction.selector)
					// 타입을 상수 문자열로 반환하여 타입 오류 해결
					return {
						type: 'hover', // 상수 'hover'로 반환
						selectorIndex: index >= 0 ? index : 0,
					}
				},
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
				// unmapper 함수: 인터랙션 객체를 record 형태로 복원
				(interaction) => {
					// 타입 단언을 통해 타입 오류 해결
					const typedInteraction = /** @type {Interaction} */ (interaction)
					// selector를 기준으로 원래 인덱스 찾기
					const index = dragInteractions.findIndex((i) => i.selector === typedInteraction.selector)
					// 타입을 상수 문자열로 반환하여 타입 오류 해결
					return {
						type: 'drag', // 상수 'drag'로 반환
						selectorIndex: index >= 0 ? index : 0,
					}
				},
			)
		arbitraries.push(dragInteractionArb)
	}

	// 필 인터랙션 처리 - 값 생성 포함, chain 사용 제거
	if (fillInteractions.length > 0) {
		// 모든 가능한 valueType을 모읅니다.
		const valueTypes = [...new Set(fillInteractions.map((i) => i.valueType || 'text'))]

		// 모든 쌍의 (selectorIndex, valueType)을 생성하는 arbitrary
		const fillBaseArb = fc.record({
			selectorIndex: fc.nat({ max: fillInteractions.length - 1 }),
			valueType: fc.constantFrom(...valueTypes),
		})

		// fc.tuple을 사용하여 독립적인 arbitrary 생성
		const fillInteractionArb = fc
			.tuple(
				fillBaseArb,
				// 두 번째 값은 사용하지 않음
				fc.constant(null),
			)
			.map(
				([base]) => {
					// 여기서 실제 필요한 값 생성
					const originalInteraction = fillInteractions[base.selectorIndex]
					const valueType = base.valueType
					// 실제 값은 test 실행 시점에 생성
					const value = getRandomValueForType(valueType)

					return {
						...originalInteraction,
						type: 'fill',
						valueType,
						value,
					}
				},
				// unmapper 함수
				(interaction) => {
					const typedInteraction = /** @type {Interaction} */ (interaction)
					const index = fillInteractions.findIndex((i) => i.selector === typedInteraction.selector)
					return [
						{
							selectorIndex: index >= 0 ? index : 0,
							valueType: typedInteraction.valueType || 'text',
						},
						null,
					]
				},
			)

		arbitraries.push(fillInteractionArb)
	}

	// 셀렉트 인터랙션 처리 - chain 사용 제거
	if (selectInteractions.length > 0) {
		// 각 select 인터랙션에 대해 선택 가능한 옵션 정보를 수집
		const selectOptionsMap = selectInteractions.reduce((map, interaction, index) => {
			map[index] = interaction.options || []
			return map
		}, {})

		// fc.tuple을 사용하여 독립적인 arbitrary 생성
		const selectInteractionArb = fc
			.tuple(
				// 첫번째 요소: 선택할 인터랙션 인덱스
				fc.nat({ max: selectInteractions.length - 1 }),
				// 두번째 요소: 옵션 인덱스(실제 값은 런타임에 결정)
				fc.constant(null),
			)
			.map(
				([selectorIndex]) => {
					const originalInteraction = selectInteractions[selectorIndex]
					const options = originalInteraction.options || []

					// 옵션이 없으면 기본 상태 반환
					if (options.length === 0) {
						return {
							...originalInteraction,
							type: 'select',
						}
					}

					// 옵션 중 하나를 랜덤하게 선택
					const selectedIndex = getSecureRandom(0, options.length - 1)
					const value = options[selectedIndex]

					return {
						...originalInteraction,
						type: 'select',
						value,
					}
				},
				// unmapper 함수
				(interaction) => {
					const typedInteraction = /** @type {Interaction} */ (interaction)
					const index = selectInteractions.findIndex(
						(i) => i.selector === typedInteraction.selector,
					)
					return [index >= 0 ? index : 0, null]
				},
			)

		arbitraries.push(selectInteractionArb)
	}

	// 범위 인터랙션 처리 - chain 사용 제거
	if (rangeInteractions.length > 0) {
		// fc.tuple을 사용하여 독립적인 arbitrary 생성
		const rangeInteractionArb = fc
			.tuple(
				// 첫번째 요소: 선택할 인터랙션 인덱스
				fc.nat({ max: rangeInteractions.length - 1 }),
				// 두번째 요소: 값은 런타임에 결정
				fc.constant(null),
			)
			.map(
				([selectorIndex]) => {
					const originalInteraction = rangeInteractions[selectorIndex]
					const min = originalInteraction.min || 0
					const max = originalInteraction.max || 100

					// min과 max 사이의 값 선택
					const value = getSecureRandom(min, max)

					return {
						...originalInteraction,
						type: 'setRange',
						value,
					}
				},
				// unmapper 함수
				(interaction) => {
					const typedInteraction = /** @type {Interaction} */ (interaction)
					const index = rangeInteractions.findIndex((i) => i.selector === typedInteraction.selector)
					return [index >= 0 ? index : 0, null]
				},
			)

		arbitraries.push(rangeInteractionArb)
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
 * 생성된 인터랙션 시퀀스를 반환합니다. 객체 래핑없이 배열을 직접 반환하여 fast-check가 효과적으로 shrinking을 수행할 수 있도록 합니다.
 *
 * @param {Interaction[]} interactions - 가능한 인터랙션 목록
 * @param {number} length - 시퀀스 길이
 * @returns {fc.Arbitrary<Interaction[]>} 인터랙션 시퀀스 arbitrary
 */
function createShrinkableSequence(interactions, length) {
	// 객체 래핑을 제거하고 배열을 직접 반환
	return createInteractionSequenceArbitrary(interactions, length)
}

/**
 * 컴포넌트 상태 검증 컴포넌트가 화면에 표시되는지 확인하고 기본 정보를 수집합니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {string} componentSelector - 컴포넌트의 최상위 셀렉터
 * @returns {Promise<{ isVisible: boolean; summary: string }>} 컴포넌트 상태 검증 결과
 */
async function verifyComponentState(page, componentSelector) {
	// 컴포넌트가 화면에 보이는지 확인
	const isVisible = await page.isVisible(componentSelector)
	const summary =
		isVisible ?
			// 컴포넌트가 보이면 자세한 정보 수집
			await page.evaluate((selector) => {
				const component = document.querySelector(selector)
				if (!component) return '컴포넌트를 찾을 수 없음'
				const childCount = component.children.length
				const classes = component.className
				const { id } = component
				return `컴포넌트 정보 - 자식 요소: ${childCount}개, 클래스: ${classes || 'none'}, ID: ${id || 'none'}`
			}, componentSelector)
		:	'컴포넌트가 화면에 표시되지 않음'
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

/** 축소된 반례를 분석하여 테스트 실패 원인 파악 */
function analyzeShrunkSequence(checkResult) {
	const counterExample = checkResult.counterexample

	// 이제 직접 배열로 받아옴 (객체의 sequence 속성이 아님)
	const shrunkSequence = counterExample[0]

	console.error('----------- 축소된 실패 케이스 분석 -----------')

	console.log('checkResult:', checkResult)

	console.error(`총 ${shrunkSequence.length}개의 인터랙션이 필요합니다`)

	// 핵심 인터랙션 식별
	if (shrunkSequence.length === 1) {
		console.error('단일 인터랙션으로 실패를 재현할 수 있습니다:')
		console.error(`- ${shrunkSequence[0].type} on (${shrunkSequence[0].selector})`)
		if (shrunkSequence[0].value !== undefined) {
			console.error(`  값: ${shrunkSequence[0].value}`)
		}
	} else {
		console.error('주요 인터랙션 시퀀스:')
		for (let i = 0; i < shrunkSequence.length; i++) {
			const interaction = shrunkSequence[i]
			console.error(`${i + 1}. ${interaction.type} on (${interaction.selector})`)
			if (interaction.value !== undefined) {
				console.error(`   값: ${interaction.value}`)
			}
		}
	}

	console.error('\n[Shrinking 과정 요약]')
	console.error(`최종 축소 단계: ${counterExample.length}회`)
	console.error('단계별 상세:')

	const counterExampleLength = counterExample.length
	const reversedCounterExample = [...counterExample].reverse()

	reversedCounterExample.forEach((sequence, sequenceIndex) => {
		if (sequenceIndex === counterExampleLength - 1) {
			console.error(`마지막 ${sequenceIndex + 1} 단계: ${sequence.length}개의 인터랙션`)
		} else {
			console.error(`${sequenceIndex + 1} 단계: ${sequence.length}개의 인터랙션`)
		}

		sequence.forEach((interaction, interactionIndex) => {
			console.error(`${interactionIndex + 1}) ${interaction.type} on (${interaction.selector})`)
		})
	})

	console.error('---------------------------------------------')
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
	console.error('----------- 축소된 실패 케이스 디버깅 시작 -----------')

	// 페이지가 닫혔는지 확인
	if (await isPageClosed(page)) {
		console.error('디버깅을 시작하려 했으나 페이지가 이미 닫혀 있습니다.')
		console.error('----------- 축소된 반례 디버깅 완료 (페이지 닫힘) -----------')
		return
	}

	// 컴포넌트 상태 초기화
	try {
		await resetComponentState(page)
	} catch (error) {
		console.error(`컴포넌트 상태 초기화 중 오류 발생: ${error.message}`)
		// 초기화 실패해도 계속 진행
	}

	// 페이지 에러와 콘솔 에러를 감지하기 위한 변수들
	let pageErrors = []
	let consoleErrors = []

	// 단계 추적용 객체
	/** @type {StepTracker} */
	const stepTracker = {
		currentStep: null,
		currentInteraction: null,
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
		console.error(`페이지 에러 감지: ${error.message}`)
		if (stepTracker.currentStep !== null) {
			console.error(`관련 인터랙션 단계: ${stepTracker.currentStep}`)
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
			console.error(`콘솔 에러 감지: ${msg.text()}`)
			if (stepTracker.currentStep !== null) {
				console.error(`관련 인터랙션 단계: ${stepTracker.currentStep}`)
			}
		}
	}

	// 페이지가 닫혔는지 다시 확인
	if (await isPageClosed(page)) {
		console.error('이벤트 핸들러 등록 전 페이지가 이미 닫혀 있습니다.')
		console.error('----------- 축소된 반례 디버깅 완료 (페이지 닫힘) -----------')
		return
	}

	// 이벤트 리스너 등록
	try {
		page.on('pageerror', pageErrorHandler)
		page.on('console', consoleErrorHandler)
	} catch (error) {
		console.error(`이벤트 리스너 등록 중 오류 발생: ${error.message}`)
		// 등록 실패해도 계속 진행
	}

	try {
		// 각 인터랙션 단계별 실행 및 상태 확인
		for (let i = 0; i < shrunkSequence.length; i++) {
			// 현재 단계 정보 설정
			stepTracker.currentStep = i + 1
			stepTracker.currentInteraction = shrunkSequence[i]

			console.error(
				`${i + 1} 단계/${shrunkSequence.length}: ${shrunkSequence[i].type} on (${shrunkSequence[i].selector})`,
			)

			// 페이지가 닫혔는지 확인
			if (await isPageClosed(page)) {
				console.error(`${i + 1} 단계 실행 전 페이지가 이미 닫혀 있습니다.`)
				break
			}

			// 이전 에러들 초기화
			pageErrors = []
			consoleErrors = []

			try {
				// 페이지가 닫혔는지 확인
				if (await isPageClosed(page)) {
					console.error(`${i + 1} 단계 실행 후 페이지가 닫혔습니다.`)
					break
				}

				// 인터랙션 실행
				const result = await executeInteraction(page, shrunkSequence[i], waitTime, true)
				console.error(`[ ${i + 1} 단계 인터랙션 실행: ${result.message} ]`)

				// 인터랙션 후 페이지 에러 확인 - shrinking을 위한 중요 지점
				if (consoleErrors.length > 0 || pageErrors.length > 0) {
					// 에러가 감지되었음을 보고
					console.error(`< ${i + 1} 단계 실행 후 에러 발생: ${result.message} >`)
					if (pageErrors.length > 0) {
						console.error(`- 페이지 에러: ${pageErrors.map((e) => e.message).join(' / ')}`)
					}
					if (consoleErrors.length > 0) {
						console.error(`- 콘솔 에러: ${consoleErrors.map((e) => e.message).join(' / ')}`)
					}

					break
				}

				// 컴포넌트 상태 확인
				try {
					const stateCheck = await verifyComponentState(page, componentSelector)
					console.error(
						`상태: ${stateCheck.isVisible ? 'visible' : 'invisible'} - ${stateCheck.summary}`,
					)
				} catch (stateError) {
					console.error(`상태 확인 중 오류 발생: ${stateError.message}`)
					// 상태 확인 실패해도 계속 진행
				}
			} catch (error) {
				// 인터랙션 실행 중 발생한 에러를 로깅하고 계속 진행
				console.error(`< ${i + 1} 단계 실행 중 에러 발생: ${error.message} >`)
				console.error(`에러 스택: ${error.stack?.split('\n')[0] || 'N/A'}`)

				// 페이지가 닫혔는지 확인
				if (await isPageClosed(page)) {
					console.error(`에러 발생 후 페이지가 닫혔습니다.`)
					break
				}

				break
			}
		}
	} catch (error) {
		// 예상치 못한 에러가 발생해도 로깅만 하고 정상 종료
		console.error(`디버깅 중 예상치 못한 에러 발생: ${error.message}`)
		console.error(`에러 스택: ${error.stack || 'N/A'}`)
	} finally {
		// 단계 추적 정보 초기화
		stepTracker.currentStep = null
		stepTracker.currentInteraction = null

		// 페이지가 닫히지 않았으면 이벤트 리스너 제거
		if (!(await isPageClosed(page))) {
			try {
				page.removeListener('pageerror', pageErrorHandler)
				page.removeListener('console', consoleErrorHandler)
			} catch (error) {
				console.error(`이벤트 리스너 제거 중 오류 발생: ${error.message}`)
			}
		} else {
			console.error('이벤트 리스너 제거를 시도했으나 페이지가 이미 닫혀 있습니다.')
		}
	}

	console.error('----------- 축소된 반례 디버깅 완료 -----------')
}

/**
 * 페이지가 닫혔는지 확인하는 헬퍼 함수 추가
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<boolean>} 페이지가 닫혔는지 여부
 */
async function isPageClosed(page) {
	try {
		// 페이지가 닫혔는지 간단한 연산으로 확인
		// 페이지가 닫혔다면 예외가 발생함
		await page.evaluate('1 + 1')
		return false // 예외가 발생하지 않으면 페이지가 열려 있음
	} catch (error) {
		return (
			error.message.includes('Target closed') ||
			error.message.includes('Target page, context or browser has been closed') ||
			error.message.includes('Protocol error')
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
		resetComponent = false,
		debugLogDir = './test-results/debug-logs',
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
		success: false,
	}

	// 필요시 컴포넌트 상태 초기화
	if (resetComponent) {
		try {
			await resetComponentState(page)
		} catch (error) {
			console.error(`컴포넌트 상태 초기화 중 오류 발생: ${error.message}`)
			// 초기화 실패해도 계속 진행
		}
	}

	// 페이지가 닫혔는지 확인
	if (await isPageClosed(page)) {
		console.error('페이지가 이미 닫혀 있습니다. 이번 반복은 중단합니다.')
		iterationInfo.success = false
		iterationInfo.errors = [
			...errors,
			{ message: '페이지가 이미 닫혀 있음', stack: new Error().stack },
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
			iterationInfo.success = true
		} catch (error) {
			console.error(`상태 확인 중 오류 발생: ${error.message}`)
			iterationInfo.success = false
			iterationInfo.errors = [...errors, { message: error.message, stack: error.stack }]
		}
		return iterationInfo
	}

	// 인터랙션 시퀀스 생성을 위한 arbitrary 생성
	const sequenceArb = createShrinkableSequence(interactions, sequenceLength)
	let failureInfo
	let checkResult = null

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
				// 이제 sequence는 직접 인터랙션 배열입니다 (객체가 아님)

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
					for (let i = 0; i < sequence.length; i++) {
						const interaction = sequence[i]

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

		if (!checkResult.failed) {
			// 테스트 성공
			iterationInfo.success = true
		} else {
			// 테스트 실패 - 축소된 반례 활용
			iterationInfo.success = false

			// fast-check의 반례가 있는지 확인
			if (checkResult.counterexample && checkResult.counterexample.length > 0) {
				console.log('💬 runSingleIteration checkResult:', checkResult)
				console.log('💬 runSingleIteration counterexample:', checkResult.counterexample)

				// shrinking 후 발견된 최소 반례
				const shrunkValue = /** @type {Interaction[]} */ (checkResult?.counterexample[0])

				// 반례 분석 (타입 확인하여 호출)
				analyzeShrunkSequence(checkResult)

				// failureInfo 타입을 맞춰서 설정
				failureInfo = {
					checkResult,
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
					// 축소된 반례로 디버깅
					try {
						await debugWithShrunkExample(page, shrunkValue, componentSelector, waitAfterInteraction)
					} catch (debugError) {
						console.error(`축소된 반례 디버깅 중 오류 발생: ${debugError.message}`)
					}
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
					analyzeShrunkSequence(counterExample)

					failureInfo = {
						counterExample: shrunkValue,
						error: { message: fcError.message, stack: fcError.stack },
						property: fcError.property?.toString(),
					}

					// 페이지가 닫히지 않았으면 디버깅 시도
					const isPageAlreadyClosed = await isPageClosed(page)
					if (!isPageAlreadyClosed) {
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
					} else {
						console.error('축소된 반례 디버깅을 시작하려 했으나 페이지가 이미 닫혀 있습니다.')
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
	console.log('시작 시간 3', new Date().toLocaleString())

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

		// 축소된 반례 정보 출력
		if (!isSuccessful && latestTestFailureInfo && latestTestFailureInfo.counterExample) {
			console.error('\n--------- 테스트 실패 정보 (축소된 반례) ---------')
			console.error(`컴포넌트: ${debugInfo.componentName}`)
			console.error('최소 실패 케이스:')

			// 축소된 반례 출력
			const shrunkSequence = latestTestFailureInfo.counterExample
			for (let i = 0; i < shrunkSequence.length; i++) {
				const interaction = shrunkSequence[i]
				console.error(`${i + 1}. ${interaction.type}`)
				if (interaction.value !== undefined) {
					console.error(`   값: ${interaction.value} on (${interaction.selector})`)
				}
			}
			test.info().attach('축소된 반례', {
				body: JSON.stringify(shrunkSequence, undefined, 2),
			})

			console.error(`에러: ${errors.map((e) => e.message).join('\n')}`)
			console.error('--------------------------------------------------\n')
		}

		// 모든 작업이 완료된 후 테스트 실패 확인
		// 이 시점에서 모든 디버깅 정보 수집과 로깅이 완료됨
		if (!isSuccessful) {
			// 최종적으로 테스트 실패 처리
			// eslint-disable-next-line playwright/missing-playwright-await
			test.step(`${componentName}: 테스트 결과 확인`, async () => {
				expect(
					false,
					`테스트 실패: 에러 발생 - ${debugInfo.errors.map((e) => e.message).join(' / ')}`,
				).toBeTruthy()
			})
		}
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

/**
 * 각 valueType에 맞는 랜덤 값을 생성합니다.
 *
 * @param {string} valueType - 값 유형 (email, number, textarea 등)
 * @returns {string} 생성된 값
 */
function getRandomValueForType(valueType) {
	switch (valueType) {
		case 'email':
			return `test${getSecureRandomString()}@example.com`
		case 'number':
			return getSecureRandom(0, 100).toString()
		case 'textarea':
			return `테스트 텍스트 ${getSecureRandomString()}`
		default:
			return `테스트 입력 ${getSecureRandomString()}`
	}
}
