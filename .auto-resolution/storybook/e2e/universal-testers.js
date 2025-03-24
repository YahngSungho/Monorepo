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
	await page.evaluate(() => {
		if (typeof globalThis.resetComponentState === 'function') {
			globalThis.resetComponentState()
		}
	})
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
 */

let currentInteraction // 현재 실행 중인 인터랙션을 추적하기 위한 변수

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
	// 인터랙션 결과 객체 초기화
	const result = {
		success: false,
		type: interaction.type,
		selector: interaction.selector,
		timestamp: new Date().toISOString(),
	}

	try {
		// 현재 실행 중인 인터랙션 정보 설정
		currentInteraction = {
			...interaction,
			timestamp: result.timestamp,
			id: `${interaction.type}-${interaction.selector}-${result.timestamp}`,
		}

		// 상세 로그 모드에서는 실행 중인 인터랙션 정보 출력
		if (verbose) {
			console.log(`실행 인터랙션: ${interaction.type} on ${interaction.selector}`)
		}

		// 대상 요소가 존재하는지 확인
		const elementExists = (await page.$(interaction.selector)) !== null
		if (!elementExists) {
			result.errorMessage = '요소가 페이지에 존재하지 않음'
			return result
		}

		// 인터랙션 타입에 따른 처리
		switch (interaction.type) {
			case 'click': {
				// 요소 클릭 수행
				await page.click(interaction.selector)
				result.message = '클릭 성공'
				break
			}
			case 'drag': {
				// 요소 드래그 앤 드롭 수행
				await page.hover(interaction.selector)
				await page.dragAndDrop(interaction.selector, interaction.selector, {
					targetPosition: { x: 10, y: 10 },
				})
				result.message = '드래그 성공'
				break
			}
			case 'fill': {
				// 입력 필드에 값 채우기 수행
				let value
				// 필드 타입에 따라 적절한 테스트 값 생성
				switch (interaction.valueType) {
					case 'email': {
						value = `test${Math.random().toString(36).slice(2)}@example.com`
						break
					}
					case 'number': {
						value = Math.floor(Math.random() * 100).toString()
						break
					}
					case 'textarea': {
						value = `테스트 텍스트 ${Math.random().toString(36).slice(2)}`
						break
					}
					default: {
						value = `테스트 입력 ${Math.random().toString(36).slice(2)}`
					}
				}
				await page.fill(interaction.selector, value)
				result.value = value
				result.message = `값 입력 성공: ${value}`
				break
			}
			case 'hover': {
				// 요소에 마우스 호버 수행
				await page.hover(interaction.selector)
				result.message = '호버 성공'
				break
			}
			case 'select': {
				// 선택 상자에서 옵션 선택
				if (interaction.options && interaction.options.length > 0) {
					// 랜덤하게 옵션 선택
					const randomIndex = Math.floor(Math.random() * interaction.options.length)
					const selectedValue = interaction.options[randomIndex]
					await page.selectOption(interaction.selector, selectedValue)
					result.value = selectedValue
					result.message = `옵션 선택 성공: ${selectedValue}`
				} else {
					result.errorMessage = '선택 가능한 옵션이 없음'
					return result
				}
				break
			}
			case 'setRange': {
				// 범위 슬라이더 값 설정
				const min = interaction.min || 0
				const max = interaction.max || 100
				const newValue = Math.floor(min + Math.random() * (max - min))

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
				break
			}
			default: {
				// 지원하지 않는 인터랙션 타입 처리
				result.errorMessage = `지원하지 않는 인터랙션 타입: ${interaction.type}`
				return result
			}
		}

		// 인터랙션 후 지정된 시간만큼 대기 (DOM 업데이트 및 애니메이션 완료를 위해)
		await page.waitForTimeout(waitTime)
		result.success = true
	} catch (error) {
		// 인터랙션 실행 중 발생한 오류 처리
		result.errorMessage = error.message
		result.errorStack = error.stack
		console.error(
			`인터랙션 실행 중 오류 발생 (${interaction.type} on ${interaction.selector}): ${error.message}`,
		)
	} finally {
		// 인터랙션 실행 완료 후 currentInteraction 유지
		// (에러 핸들러에서 참조할 수 있도록)
	}
	return result
}

/**
 * 인터랙션 시퀀스 생성을 위한 fast-check arbitrary 생성 fast-check 라이브러리를 사용해 무작위 인터랙션 시퀀스를 생성합니다.
 *
 * @param {Interaction[]} interactions - 가능한 인터랙션 목록
 * @param {number} length - 시퀀스 길이
 * @returns {fc.Arbitrary<Interaction[]>} 인터랙션 시퀀스 arbitrary
 */
function createInteractionSequenceArbitrary(interactions, length) {
	// 가용 인터랙션이 없는 경우 빈 배열 반환
	if (interactions.length === 0) {
		return fc.constant([])
	}

	// 모든 가능한 인터랙션 중에서 무작위로 선택하는 arbitrary 생성
	const interactionArbitrary = fc.constantFrom(...interactions)
	// 인터랙션 배열(시퀀스)을 생성하는 arbitrary 생성
	// 길이는 1~length 사이가 됨
	return fc.array(interactionArbitrary, { minLength: 1, maxLength: length + interactions.length })
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
 * 디버그 정보를 파일로 저장 테스트 실행 결과와 디버그 정보를 JSON 파일로 저장합니다.
 *
 * @param {string} dir - 저장할 디렉토리
 * @param {string} filename - 파일 이름
 * @param {object} data - 저장할 데이터
 */
async function saveDebugInfo(dir, filename, data) {
	try {
		// 디렉토리가 없으면 생성
		await fs.mkdir(dir, { recursive: true })
		// JSON 형식으로 데이터 저장
		await fs.writeFile(path.join(dir, filename), JSON.stringify(data, undefined, 2), 'utf8')
	} catch (error) {
		console.error(`디버그 정보 저장 실패: ${error.message}`)
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
	let isSuccessful = true

	try {
		// fast-check를 사용하여 property-based 테스트 실행
		await fc.assert(
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
					errors,
					startTime: new Date().toISOString(),
				}
				if (config.verbose) {
					console.log(`시퀀스 실행 (${sequence.length}개 인터랙션)`)
				}

				// 시퀀스의 각 인터랙션 차례로 실행
				for (const interaction of sequence) {
					const result = await executeInteraction(page, interaction, waitAfterInteraction, verbose)
					sequenceInfo.results.push(result)

					if (!result.success) {
						test.step(`인터랙션 실패: ${interaction.type} on ${interaction.selector}`, () => {
							expect(result.success, result.errorMessage).toBe(true)
						})

						if (captureScreenshots) {
							const timestamp = getTimestamp()
							const componentName = extractComponentName(page.url())
							const screenshotFilename = `failure-${componentName}-i${iteration + 1}-${timestamp}.png`
							const screenshotPath = path.join(debugLogDir, screenshotFilename)
							await fs.mkdir(debugLogDir, { recursive: true })
							await page.screenshot({ path: screenshotPath, fullPage: true })
							sequenceInfo.screenshotPath = screenshotPath
							console.error(`인터랙션 실패 스크린샷 저장: ${screenshotPath}`)
						}
					}

					// 각 인터랙션 이후에 페이지/콘솔 에러 검사
					if (errors.length > 0) {
						// 가장 최근 에러가 현재 인터랙션과 관련된 것인지 확인
						const recentErrors = errors.filter(
							// eslint-disable-next-line no-loop-func
							(error) =>
								error.associatedInteraction &&
								error.associatedInteraction.id === currentInteraction.id,
						)

						if (recentErrors.length > 0) {
							console.error(
								`인터랙션 "${interaction.type} on ${interaction.selector}" 이후 에러 발생:`,
							)
							for (const error of recentErrors) {
								console.error(`- ${error.message}`)
							}

							// 에러 발생 시 스크린샷 캡처
							if (captureScreenshots) {
								const timestamp = getTimestamp()
								const componentName = extractComponentName(page.url())
								const screenshotFilename = `error-after-interaction-${componentName}-i${iteration + 1}-${timestamp}.png`
								const screenshotPath = path.join(debugLogDir, screenshotFilename)
								await fs.mkdir(debugLogDir, { recursive: true })
								await page.screenshot({ path: screenshotPath, fullPage: true })
								if (config.verbose) {
									console.log(`스크린샷: ${screenshotPath}`)
								}
							}
						}
					}
				}

				// 시퀀스 실행 후 컴포넌트 상태 검증
				const stateCheck = await verifyComponentState(page, componentSelector)
				sequenceInfo.finalState = stateCheck.summary
				sequenceInfo.endTime = new Date().toISOString()
				iterationInfo.sequences.push(sequenceInfo)

				errors.push(
					...sequenceInfo.results
						.filter((result) => !result.success)
						.map((result) => ({
							message: result.errorMessage,
							stack: result.errorStack,
						})),
				)

				// 시퀀스 성공 여부 확인 (오류가 없어야 성공)
				const sequenceSuccess = errors.length === 0
				if (!sequenceSuccess) {
					iterationInfo.errors = errors

					// 실패 시 스크린샷 캡처
					if (captureScreenshots) {
						const timestamp = getTimestamp()
						const componentName = extractComponentName(page.url())
						const screenshotFilename = `failure-summary-${componentName}-i${iteration + 1}-${timestamp}.png`
						const screenshotPath = path.join(debugLogDir, screenshotFilename)

						// 비동기 작업 전에 경로 설정
						iterationInfo.screenshotPath = screenshotPath

						await fs.mkdir(debugLogDir, { recursive: true })
						await page.screenshot({ path: screenshotPath, fullPage: true })
					}

					console.error(
						'테스트 실패:',
						errors.length > 0 ?
							`에러 발생: ${errors.map((error) => error.message).join(', ')}`
						:	'컴포넌트 상태가 올바르지 않음',
					)
					isSuccessful = false
				}

				return sequenceSuccess
			}),
			{
				numRuns,
				verbose: true,
				endOnFailure: true,
			},
		)
	} catch (fcError) {
		// fast-check 반례 발견 시 실패 정보 기록
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
		isSuccessful = false
	}

	iterationInfo.success = isSuccessful
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
	const debugFilename = `test-${debugInfo.componentName}-${debugInfo.timestamp}.json`
	await saveDebugInfo(debugLogDir, debugFilename, debugInfo)
	if (config.verbose) {
		console.log(`테스트 디버그 정보 저장: ${debugFilename}`)
	}

	const latestTestFailureInfo = debugInfo.iterations.at(-1)?.failureInfo
	const debugFilePath = path.join(
		debugLogDir,
		`test-${debugInfo.componentName}-${debugInfo.timestamp}.json`,
	)
	debugInfo.debugFilePath = debugFilePath

	// 실패 시 최종 스크린샷 캡처 및 상세 정보 출력
	if (!isSuccessful && captureScreenshots) {
		// 스크린샷 경로는 PNG 확장자를 사용
		const screenshotPath = `${debugFilePath.replace(/\.json$/, '.png')}`
		debugInfo.screenshotPath = screenshotPath // 디버그 정보에 스크린샷 경로 저장
		await page.screenshot({ path: screenshotPath, fullPage: true })
		if (config.verbose) {
			console.log(`최종 상태 스크린샷 저장: ${screenshotPath}`)
		}

		if (latestTestFailureInfo) {
			console.log('\n--------- 테스트 실패 정보 ---------')
			console.log(`컴포넌트: ${debugInfo.componentName}`)
			console.log(
				`실패 인터랙션 시퀀스: ${JSON.stringify(latestTestFailureInfo.counterExample, undefined, 2)}`,
			)
			console.log(`에러: ${errors.join('\n')}`)
			console.log('-------------------------------------\n')
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
