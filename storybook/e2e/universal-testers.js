/* eslint-disable functional/immutable-data */
/**
 * @file Storybook UI 컴포넌트에 대한 범용 테스트 유틸리티 - 고급 디버깅 개선 버전 모든 Presentational 컴포넌트에 적용 가능한 범용성을 목표로
 *   작성됨.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

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
 * @property {string} [debugLogDir='./test-results/debug-logs'] - 스크린샷 저장 디렉토리. Default is
 *   `'./test-results/debug-logs'`
 * @property {boolean} [captureScreenshots=true] - 실패 시 스크린샷 캡처 여부. Default is `true`
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
 * @property {string} [screenshotPath] - 스크린샷 저장 경로
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
 * @property {string} [screenshotPath] - 스크린샷 저장 경로
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

		default: {
			if (role === 'button' || hasOnClick) {
				interactions.push({ type: 'click', selector }, { type: 'hover', selector })
			}

			if (['listbox', 'menu', 'tablist'].includes(role)) {
				interactions.push({ type: 'click', selector })
			}

			if (draggable) {
				interactions.push({ type: 'drag', selector })
			}
		}
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
	// crypto 모듈이 있는 환경에서는 이를 사용하는 것이 더 안전하나,
	// 간단한 테스트 용도로는 Math.random을 사용해도 괜찮음
	return Math.floor(min + Math.random() * (max - min + 1))
}

/**
 * 안전한 임의 문자열 생성 함수
 *
 * @param {number} length - 생성할 문자열 길이
 * @returns {string} 생성된 임의 문자열
 */
function getSecureRandomString(length = 8) {
	return Array.from({ length }, () => ((Math.random() * 36) | 0).toString(36)).join('')
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
		id: `${interaction.type}-${interaction.selector}-${result.timestamp}`,
	}

	// 상세 로그 출력
	if (verbose) {
		console.log(`실행 인터랙션: ${interaction.type} on ${interaction.selector}`)
	}

	try {
		// 대상 요소가 존재하는지 확인
		const elementExists = (await page.$(interaction.selector)) !== null
		if (!elementExists) {
			const error = new Error(`요소가 페이지에 존재하지 않음: ${interaction.selector}`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result // 요소가 없을 경우 결과 객체 반환, 예외를 던지지 않음
		}

		// 요소의 상호작용 가능 상태 확인 (visible, enabled 등)
		const isVisible = await page.isVisible(interaction.selector)
		if (!isVisible) {
			const error = new Error(`요소가 화면에 표시되지 않음: ${interaction.selector}`)
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
			const error = new Error(`요소가 비활성화됨: ${interaction.selector}`)
			result.errorMessage = error.message
			result.errorStack = error.stack
			return result
		}

		// 인터랙션 타입에 따른 처리
		await executeInteractionByType(page, interaction, result)

		// 인터랙션 후 지정된 시간만큼 대기
		await page.waitForTimeout(waitTime)
		result.success = true
	} catch (error) {
		// 에러 정보 기록
		result.errorMessage = error.message
		result.errorStack = error.stack
		result.error = error // 원본 에러 객체도 보존

		if (verbose) {
			console.error(
				`인터랙션 실행 중 오류 발생 (${interaction.type} on ${interaction.selector}): ${error.message}`,
			)
		}
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
				result.message = '클릭 성공'
				break
			}
			case 'drag': {
				await page.hover(interaction.selector)
				await page.dragAndDrop(interaction.selector, interaction.selector, {
					targetPosition: { x: 10, y: 10 },
					timeout: 5000, // 타임아웃 추가
				})
				result.message = '드래그 성공'
				break
			}
			case 'fill': {
				await executeFillInteraction(page, interaction, result)
				break
			}
			case 'hover': {
				await page.hover(interaction.selector, { timeout: 5000 }) // 타임아웃 추가
				result.message = '호버 성공'
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
				throw new Error(`지원하지 않는 인터랙션 타입: ${interaction.type}`)
			}
		}
		result.success = true
	} catch (error) {
		result.errorMessage = error.message
		result.errorStack = error.stack
		result.error = error
		result.success = false
		throw error // 상위 함수에서 처리할 수 있도록 에러 전파
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
	result.message = `값 입력 성공: ${value}`
}

/** Select 인터랙션 실행 */
async function executeSelectInteraction(page, interaction, result) {
	if (interaction.value !== undefined) {
		// 생성된 값 사용
		await page.selectOption(interaction.selector, interaction.value)
		result.value = interaction.value
		result.message = `옵션 선택 성공: ${interaction.value}`
	} else if (interaction.options && interaction.options.length > 0) {
		// 랜덤하게 옵션 선택
		const randomIndex = getSecureRandom(0, interaction.options.length - 1)
		const selectedValue = interaction.options[randomIndex]
		await page.selectOption(interaction.selector, selectedValue)
		result.value = selectedValue
		result.message = `옵션 선택 성공: ${selectedValue}`
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
	result.message = `범위 값 설정 성공: ${newValue}`
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

	// 1단계: 인터랙션 타입별 Arbitrary 생성
	const fillInteractions = interactions.filter((i) => i.type === 'fill')
	const clickInteractions = interactions.filter((i) => i.type === 'click')
	const hoverInteractions = interactions.filter((i) => i.type === 'hover')
	const selectInteractions = interactions.filter((i) => i.type === 'select')
	const rangeInteractions = interactions.filter((i) => i.type === 'setRange')
	const dragInteractions = interactions.filter((i) => i.type === 'drag')

	// 타입별 특화된 arbitrary 생성
	const arbitraries = []

	// fill 타입 처리 - 값 생성 포함
	if (fillInteractions.length > 0) {
		const fillArb = fc.constantFrom(...fillInteractions).chain((interaction) => {
			// 입력 타입에 따른 적절한 값 생성
			let valueArb
			switch (interaction.valueType) {
				case 'email':
					valueArb = fc.emailAddress() // 자동으로 단순한 이메일로 축소됨
					break
				case 'number':
					valueArb = fc.nat(100) // 0~100 사이의 자연수
					break
				case 'textarea':
					valueArb = fc.string() // 문자열
					break
				default:
					valueArb = fc.string() // 문자열
			}

			// 값이 포함된 새 인터랙션 객체 생성
			return valueArb.map((value) => ({
				...interaction,
				value,
			}))
		})
		arbitraries.push(fillArb)
	}

	// select 타입 처리 - 옵션 선택 포함
	if (selectInteractions.length > 0) {
		const selectArb = fc.constantFrom(...selectInteractions).chain((interaction) => {
			if (!interaction.options || interaction.options.length === 0) {
				return fc.constant({ ...interaction })
			}

			// 옵션 중 하나 선택
			return fc.constantFrom(...interaction.options).map((selectedOption) => ({
				...interaction,
				value: selectedOption,
			}))
		})
		arbitraries.push(selectArb)
	}

	// setRange 타입 처리 - 값 범위 처리
	if (rangeInteractions.length > 0) {
		const rangeArb = fc.constantFrom(...rangeInteractions).chain((interaction) => {
			const min = interaction.min || 0
			const max = interaction.max || 100

			// min~max 사이의 정수 생성
			return fc.nat(max - min).map((value) => ({
				...interaction,
				value: value + min,
			}))
		})
		arbitraries.push(rangeArb)
	}

	// 값이 필요없는 간단한 인터랙션 처리
	if (clickInteractions.length > 0) {
		arbitraries.push(fc.constantFrom(...clickInteractions))
	}

	if (hoverInteractions.length > 0) {
		arbitraries.push(fc.constantFrom(...hoverInteractions))
	}

	if (dragInteractions.length > 0) {
		arbitraries.push(fc.constantFrom(...dragInteractions))
	}

	// 2단계: 최종 시퀀스 Arbitrary 생성
	const interactionArb = fc.oneof(...arbitraries)

	// 배열 길이와 요소가 자동으로 축소되도록 함
	return fc.array(interactionArb, { minLength: 1, maxLength: length })
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
 * 안전한 스크린샷 캡처 함수
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {string} screenshotPath - 저장 경로
 * @param {object} options - 스크린샷 옵션
 * @returns {Promise<{ success: boolean; path?: string; error?: Error }>} 캡처 결과
 */
async function captureScreenshot(page, screenshotPath, options = {}) {
	try {
		// 디렉토리 생성
		const dir = path.dirname(screenshotPath)
		await fs.mkdir(dir, { recursive: true })

		// 스크린샷 캡처
		await page.screenshot({ path: screenshotPath, ...options })
		return { success: true, path: screenshotPath }
	} catch (error) {
		console.error(`스크린샷 캡처 실패: ${error.message}`)
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

/**
 * 축소된 반례를 분석하여 테스트 실패 원인 파악
 *
 * @param {Interaction[]} shrunkSequence - 축소된 인터랙션 시퀀스
 */
function analyzeShrunkSequence(shrunkSequence) {
	console.log('----------- 축소된 실패 케이스 분석 -----------')
	console.log(`총 ${shrunkSequence.length}개의 인터랙션이 필요합니다`)

	// 인터랙션 타입별 분류
	const typeCount = {}
	for (const interaction of shrunkSequence) {
		typeCount[interaction.type] = (typeCount[interaction.type] || 0) + 1
	}

	console.log('인터랙션 타입 분포:')
	for (const [type, count] of Object.entries(typeCount)) {
		console.log(`- ${type}: ${count}개`)
	}

	// 핵심 인터랙션 식별
	if (shrunkSequence.length === 1) {
		console.log('단일 인터랙션으로 실패를 재현할 수 있습니다:')
		console.log(`- ${shrunkSequence[0].type} on ${shrunkSequence[0].selector}`)
		if (shrunkSequence[0].value !== undefined) {
			console.log(`  값: ${shrunkSequence[0].value}`)
		}
	} else {
		console.log('주요 인터랙션 시퀀스:')
		for (let i = 0; i < shrunkSequence.length; i++) {
			const interaction = shrunkSequence[i]
			console.log(`${i + 1}. ${interaction.type} on ${interaction.selector}`)
			if (interaction.value !== undefined) {
				console.log(`   값: ${interaction.value}`)
			}
		}
	}

	console.log('---------------------------------------------')
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
	console.log('축소된 반례를 사용한 디버깅 시작...')

	// 컴포넌트 상태 초기화
	await resetComponentState(page)

	// 페이지 에러와 콘솔 에러를 감지하기 위한 변수들
	let pageErrors = []
	let consoleErrors = []

	// 페이지 에러 이벤트 리스너 등록
	const pageErrorHandler = (error) => {
		pageErrors.push({
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
		})
		console.error(`페이지 에러 감지: ${error.message}`)
	}

	// 콘솔 에러 이벤트 리스너 등록
	const consoleErrorHandler = (msg) => {
		if (msg.type() === 'error') {
			consoleErrors.push({
				message: msg.text(),
				timestamp: new Date().toISOString(),
			})
			console.error(`콘솔 에러 감지: ${msg.text()}`)
		}
	}

	// 이벤트 리스너 등록
	page.on('pageerror', pageErrorHandler)
	page.on('console', consoleErrorHandler)

	try {
		// 각 인터랙션 단계별 실행 및 상태 확인
		for (let i = 0; i < shrunkSequence.length; i++) {
			console.log(
				`단계 ${i + 1}/${shrunkSequence.length}: ${shrunkSequence[i].type} on ${shrunkSequence[i].selector}`,
			)

			// 이전 에러들 초기화
			pageErrors = []
			consoleErrors = []

			try {
				// 인터랙션 실행
				const result = await executeInteraction(page, shrunkSequence[i], waitTime, true)
				console.log(`단계 ${i + 1} 인터랙션 실행: ${result.message || 'OK'}`)

				// 비동기 작업이나 이벤트 핸들러에서 발생하는 에러를 감지하기 위해 추가 대기 시간 설정
				// 이 대기 시간 동안 이벤트 핸들러가 실행되고 에러가 발생할 수 있음
				await page.waitForTimeout(300) // 300ms 정도 대기하여 이벤트 핸들러 실행 시간 제공

				// 컴포넌트 상태 확인
				const state = await verifyComponentState(page, componentSelector)
				console.log(`상태: ${state.isVisible ? '정상' : '문제있음'} - ${state.summary}`)

				// 에러 발생 여부 확인
				const hasErrors = pageErrors.length > 0 || consoleErrors.length > 0

				if (hasErrors) {
					console.error(`단계 ${i + 1} 실행 후 에러 발생 감지됨:`)
					if (pageErrors.length > 0) {
						console.error(`- 페이지 에러: ${pageErrors.map((e) => e.message).join(', ')}`)
					}
					if (consoleErrors.length > 0) {
						console.error(`- 콘솔 에러: ${consoleErrors.map((e) => e.message).join(', ')}`)
					}

					throw new Error(
						`단계 ${i + 1} 실행 후 에러 발생: ${[...pageErrors, ...consoleErrors].map((e) => e.message).join(', ')}`,
					)
				}
			} catch (error) {
				console.error(`단계 ${i + 1} 실패: ${error.message}`)
				console.error(`실패 지점 발견: 단계 ${i + 1}`)

				// 실패 시 스크린샷 캡처
				const timestamp = getTimestamp()
				const debugLogDir = './test-results/debug-logs'
				const screenshotPath = path.join(debugLogDir, `failure-step${i + 1}-${timestamp}.png`)
				const screenshotResult = await captureScreenshot(page, screenshotPath)
				if (screenshotResult.success) {
					console.error(`실패 스크린샷: ${screenshotResult.path}`)
				}

				break
			}
		}
	} finally {
		// 항상 이벤트 리스너 제거
		page.removeListener('pageerror', pageErrorHandler)
		page.removeListener('console', consoleErrorHandler)
	}

	console.log('축소된 반례 디버깅 완료')
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
		captureScreenshots = true,
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
		await resetComponentState(page)
	}

	// 인터랙티브 요소 탐색하여 가능한 인터랙션 목록 가져오기
	const interactions = await discoverInteractions(page, componentSelector)
	if (config.verbose) {
		console.log(`발견된 인터랙션 수: ${interactions.length}`)
	}

	// 인터랙티브 요소가 없으면 기본 렌더링 상태만 확인하고 계속 진행
	if (interactions.length === 0) {
		if (config.verbose) {
			console.log('인터랙티브 요소 발견되지 않음. 기본 렌더링 상태 확인.')
		}
		const stateCheck = await verifyComponentState(page, componentSelector)
		iterationInfo.stateSummary = stateCheck.summary
		iterationInfo.noInteractions = true
		iterationInfo.success = true
		return iterationInfo
	}

	// 인터랙션 시퀀스 생성을 위한 arbitrary 생성
	const sequenceArbitrary = createInteractionSequenceArbitrary(interactions, sequenceLength)
	let failureInfo

	try {
		const checkResult = await fc.check(
			fc.asyncProperty(sequenceArbitrary, async (sequence) => {
				// 시퀀스 정보 초기화
				/**
				 * @type {{
				 * 	results: InteractionResult[]
				 * 	errors: any[]
				 * 	startTime: string
				 * 	finalState?: string
				 * 	endTime?: string
				 * 	screenshotPath?: string
				 * }}
				 */
				const sequenceInfo = {
					/** @type {InteractionResult[]} */
					results: [],
					errors: [],
					startTime: new Date().toISOString(),
				}
				if (config.verbose) {
					console.log(`시퀀스 실행 (${sequence.length}개 인터랙션)`)
				}

				// 시퀀스의 각 인터랙션 차례로 실행
				try {
					for (const interaction of sequence) {
						const result = await executeInteraction(
							page,
							interaction,
							waitAfterInteraction,
							verbose,
						)
						sequenceInfo.results.push(result)

						// 인터랙션이 실패했을 경우 처리
						if (!result.success) {
							if (result.errorMessage) {
								errors.push({
									message: result.errorMessage,
									stack: result.errorStack,
								})
								sequenceInfo.errors.push({
									message: result.errorMessage,
									stack: result.errorStack,
								})
							}
							// 성공 여부를 체크하여 중단
							return false
						}
					}

					// 시퀀스 실행 후 컴포넌트 상태 검증
					const stateCheck = await verifyComponentState(page, componentSelector)
					sequenceInfo.finalState = stateCheck.summary
					sequenceInfo.endTime = new Date().toISOString()
					iterationInfo.sequences.push(sequenceInfo)

					// 시퀀스 성공 여부 확인
					return stateCheck.isVisible
				} catch (error) {
					// 예상치 못한 에러 발생 시 처리
					errors.push({
						message: error.message,
						stack: error.stack,
					})

					sequenceInfo.endTime = new Date().toISOString()
					iterationInfo.sequences.push(sequenceInfo)

					return false
				}
			}),
			{
				numRuns,
				verbose: true,
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
				// shrinking 후 발견된 최소 반례
				const shrunkValue = checkResult.counterexample[0]

				// 반례 분석 (타입 확인하여 호출)
				if (Array.isArray(shrunkValue)) {
					analyzeShrunkSequence(shrunkValue)

					// failureInfo 타입을 맞춰서 설정
					failureInfo = {
						counterExample: shrunkValue,
						error: {
							message: 'Property failed',
							stack: checkResult.failed ? 'Fast-check 속성 검증 실패' : '',
						},
						property: 'Component interaction sequence',
					}

					// 축소된 반례로 디버깅
					await debugWithShrunkExample(page, shrunkValue, componentSelector, waitAfterInteraction)
				} else {
					console.error('반례가 예상된 형식이 아닙니다:', shrunkValue)
				}
			} else {
				console.error('반례를 찾을 수 없습니다')
			}
			// 실패 시 스크린샷 캡처
			if (captureScreenshots) {
				const timestamp = getTimestamp()
				const componentName = extractComponentName(page.url())
				const screenshotFilename = `failure-summary-${componentName}-i${iteration + 1}-${timestamp}.png`
				const screenshotPath = path.join(debugLogDir, screenshotFilename)

				// 비동기 작업 전에 경로 설정
				iterationInfo.screenshotPath = screenshotPath

				// 안전한 스크린샷 캡처 함수 사용
				const screenshotResult = await captureScreenshot(page, screenshotPath, { fullPage: true })
				if (screenshotResult.success && config.verbose) {
					console.log(`실패 케이스 스크린샷: ${screenshotResult.path}`)
				}
			}
		}
	} catch (fcError) {
		// fast-check 자체 에러 발생 시
		failureInfo = {
			counterExample: fcError.counterexample,
			error: { message: fcError.message, stack: fcError.stack },
			property: fcError.property?.toString(),
		}
		console.error('--------------------------------')
		console.error('Fast-check 테스트 실패:')
		if (fcError.counterexample) {
			console.error(`반례 발견: ${JSON.stringify(fcError.counterexample, undefined, 2)}`)
		}
		console.error(`오류 메시지: ${fcError.message}`)
		for (const error of errors) {
			console.error('- Error:', error)
		}
		console.error('--------------------------------')
		iterationInfo.success = false
	}

	iterationInfo.failureInfo = failureInfo
	// 최종 컴포넌트 상태 검증
	const finalStateCheck = await verifyComponentState(page, componentSelector)
	iterationInfo.finalState = finalStateCheck
	// 반복 정보 마무리 및 저장
	iterationInfo.endTime = new Date().toISOString()

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
		debugLogDir = './test-results/debug-logs', // 스크린샷 저장 경로
		captureScreenshots = true, // 실패 시 스크린샷 캡처 여부
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
		const associatedInteractionMessage = `관련 인터랙션: ${currentInteraction.type} on ${currentInteraction.selector}`

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
				console.error(`관련 인터랙션: ${currentInteraction.type} on ${currentInteraction.selector}`)
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

			// 중요: await을 사용하지 않아야 runSingleIteration 내부의 analyzeShrunkSequence 함수가 호출됨
			// eslint-disable-next-line playwright/missing-playwright-await
			test.step(`${componentName} - 반복#${iteration + 1}: 페이지 또는 콘솔 에러가 발생하지 않아야 합니다`, async () => {
				expect(errors, `다음 오류가 발생했습니다: ${errors.join(', ')}`).toHaveLength(0)
			})
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

		// 중요: await을 사용하지 않아야 runSingleIteration 내부의 analyzeShrunkSequence 함수가 호출됨
		// eslint-disable-next-line playwright/missing-playwright-await
		test.step(`${componentName}: 테스트 진행 중 오류 발생`, async () => {
			expect(debugInfo.errors, `다음 오류가 발생했습니다: ${error.message}`).toHaveLength(0)
		})
	} finally {
		// 이벤트 리스너 제거
		page.removeListener('pageerror', errorHandler)
		page.removeListener('console', consoleErrorHandler)
	}

	// 디버그 정보 최종 업데이트 및 저장
	debugInfo.success = isSuccessful
	debugInfo.errors = debugInfo.errors.concat(errors)

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

	// 실패 시 최종 스크린샷 캡처 및 상세 정보 출력
	if (!isSuccessful && captureScreenshots) {
		// 스크린샷 경로는 PNG 확장자를 사용
		const screenshotPath =
			debugInfo.debugFilePath ?
				`${debugInfo.debugFilePath.replace(/\.json$/, '.png')}`
			:	path.join(debugLogDir, `test-${debugInfo.componentName}-${debugInfo.timestamp}.png`)

		// 안전한 스크린샷 캡처 함수 사용
		const screenshotResult = await captureScreenshot(page, screenshotPath, { fullPage: true })
		if (screenshotResult.success) {
			debugInfo.screenshotPath = screenshotResult.path // 디버그 정보에 스크린샷 경로 저장
			if (config.verbose) {
				console.log(`최종 상태 스크린샷 저장: ${screenshotResult.path}`)
			}
		}

		// 축소된 반례 정보 출력
		if (latestTestFailureInfo && latestTestFailureInfo.counterExample) {
			console.log('\n--------- 테스트 실패 정보 (축소된 반례) ---------')
			console.log(`컴포넌트: ${debugInfo.componentName}`)
			console.log('최소 실패 케이스:')

			// 축소된 반례 출력
			const shrunkSequence = latestTestFailureInfo.counterExample
			for (let i = 0; i < shrunkSequence.length; i++) {
				const interaction = shrunkSequence[i]
				console.log(`${i + 1}. ${interaction.type} on ${interaction.selector}`)
				if (interaction.value !== undefined) {
					console.log(`   값: ${interaction.value}`)
				}
			}

			console.log(`에러: ${errors.map((e) => e.message).join('\n')}`)
			console.log('--------------------------------------------------\n')
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
