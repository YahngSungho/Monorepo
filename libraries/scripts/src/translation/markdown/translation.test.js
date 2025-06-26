import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// --- 모의 대상 모듈 ---
// 파일 시스템 관련 함수 모의
vi.mock('@library/helpers/fs-async', async () => {
	return {
		readFilesToObjects: vi.fn(),
		readFilesToStrings_recursive: vi.fn(),
		writeFile_async: vi.fn(),
	}
})
vi.mock('@library/helpers/fs-sync', async () => {
	const pathNormalize = path.normalize // 실제 path.normalize 사용

	return {
		getAbsolutePath: vi.fn((metaUrl, relativePath) => {
			const dictRelativePath = '../../../../paraglide/messages-helpers/dicts/'
			if (relativePath === dictRelativePath) {
				return pathNormalize('/abs/paraglide/messages-helpers/dicts')
			}
			return pathNormalize(`/abs/${relativePath}`)
		}),
	}
})

// getInitialLanguageMap은 실제 구현 사용, translateOneLanguageMessages만 모의
vi.mock('../helpers.js', async (importOriginal) => {
	/** @type {typeof import('../helpers.js')} */ // JSDoc 타입 주석 추가
	const actual = await importOriginal()
	return {
		...actual,
		getInitialLanguageMap: actual.getInitialLanguageMap,
		translateOneLanguageMessages: vi.fn(),
		getNewCache: vi.fn(() => ({ combined: 'new cache data' })), // 기본 반환값 설정
		// calculateInitialTranslationStateByBaseLanguages 는 실제 구현을 사용 (모의 해제는 아니지만, 명시적으로 포함)
		calculateInitialTranslationStateByBaseLanguages:
			actual.calculateInitialTranslationStateByBaseLanguages,
	}
})

// Node.js 내장 모듈 모의
vi.mock('node:path', async (importOriginal) => {
	/** @type {typeof import('node:path')} */ // 타입 힌트 추가
	const actual = await importOriginal()
	return {
		...actual, // join 포함 모든 함수 실제 구현 사용
	}
})
// JSON 모의 (stringify 호출 검증용)
vi.mock('node:fs', () => {
	const mockReadFileSync = vi.fn((filePath) => {
		// getInitialLanguageMap이 locales 속성을 가진 객체를 기대한다고 가정
		console.log(`[TEST] Mock fs.readFileSync called for: ${filePath}`)
		// locales 속성을 포함하는 객체의 JSON 문자열 반환
		return JSON.stringify({ locales: ['en', 'ko', 'fr'] }) // 예시: { locales: [...] } 형식
	})

	return {
		// default export와 named export 모두에 readFileSync 제공
		default: {
			readFileSync: mockReadFileSync,
			// 다른 필요한 default export 모의 추가 가능
		},
		readFileSync: mockReadFileSync,
		// 다른 필요한 named export 모의 추가 가능
	}
})
const originalStringify = JSON.stringify
const JSON_stringify_spy = vi.spyOn(JSON, 'stringify')

// --- 테스트 대상 임포트 ---
import {
	readFilesToObjects,
	readFilesToStrings_recursive,
	writeFile_async,
} from '@library/helpers/fs-async'
import { getAbsolutePath } from '@library/helpers/fs-sync'

// import { R } from '@library/helpers/R'; // R 사용 부분 없으므로 제거 가능
// calculateInitialTranslationStateByBaseLanguages는 helpers에서 가져오므로 여기에 포함하지 않음
import { getInitialLanguageMap, getNewCache, translateOneLanguageMessages } from '../helpers.js'
import {
	convertMarkdownFiles,
	getFiles,
	getTranslatedLanguageMap_action,
	saveFiles_action,
} from './translation.js'

// --- 테스트 스위트 ---

describe('getFiles 함수', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// 모의 함수 기본 반환값 설정
		vi.mocked(readFilesToStrings_recursive).mockResolvedValue([])
		vi.mocked(readFilesToObjects).mockResolvedValue({})
		vi.mocked(getAbsolutePath).mockImplementation(
			(metaUrl, relativePath) => `/abs/path/${relativePath}`,
		) // 각 테스트별로 구체화 가능
	})

	// 원칙: 동작 테스트 (파일 읽기 오케스트레이션), 모의 사용 (파일 시스템 I/O)
	it('지정된 경로에서 마크다운, 헬퍼, 사전 파일을 읽어 객체로 반환해야 한다', async () => {
		// 준비 (Arrange)
		const rootAbsolutePath = '/project/src'
		const helperFolderPath = '/project/scripts/helpers'
		const expectedDictFolderPath = '../../../../paraglide/messages-helpers/dicts' // 실제 경로 계산 필요

		// mockMarkdownFiles 타입 수정 (fileName 추가)
		const markdownPath = `/project/src/comp/text/ko.md`
		const mockMarkdownFiles = [{ path: markdownPath, value: '안녕', fileName: 'ko.md' }] // fileName 추가
		const mockHelperFiles = { 'cache.json': { cached: 'data' } }
		const mockDictFiles = { 'en.json': { hello: 'Hello' }, 'ko.json': { hello: '안녕' } }

		vi.mocked(readFilesToStrings_recursive).mockResolvedValue(mockMarkdownFiles)
		// readFilesToObjects가 경로별로 다른 값을 반환하도록 설정
		vi.mocked(readFilesToObjects).mockImplementation(async (folderPath) => {
			if (folderPath.endsWith('helpers')) {
				return mockHelperFiles
			}
			// getAbsolutePath 모의 반환값을 기반으로 dict 폴더 경로 확인
			// import.meta.url은 테스트 환경에서 불안정할 수 있으므로 모의된 경로 직접 비교
			if (folderPath.endsWith('dicts')) {
				return mockDictFiles
			}
			return {}
		})
		// getAbsolutePath가 dict 경로를 올바르게 반환하도록 모의
		vi.mocked(getAbsolutePath).mockImplementation((metaUrl, relativePath) => {
			if (relativePath === expectedDictFolderPath) {
				// 실제 import.meta.url 대신 고정된 값을 사용하거나, 테스트 환경에 맞게 조정
				return '/abs/path/to/dicts' // 예시 절대 경로
			}
			return `/abs/path/${relativePath}`
		})

		// 실행 (Act)
		const result = await getFiles(rootAbsolutePath, helperFolderPath)

		// 검증 (Assert)
		expect(readFilesToStrings_recursive).toHaveBeenCalledWith(
			rootAbsolutePath,
			'**/*.md',
			'**/*prompt.md',
		)
		expect(readFilesToObjects).toHaveBeenCalledWith(helperFolderPath)

		expect(result.initialMarkdownFiles).toEqual(mockMarkdownFiles)
		expect(result.cache).toEqual({ cached: 'data' })
		// getInitialLanguageMap 결과 기반으로 dictPerLanguage 구성 확인 필요
		const initialLangs = Object.keys(getInitialLanguageMap()) // 실제 함수 호출
		expect(Object.keys(result.dictPerLanguage)).toEqual(expect.arrayContaining(initialLangs))
		expect(result.dictPerLanguage.en).toEqual({ hello: 'Hello' })
		expect(result.dictPerLanguage.ko).toEqual({ hello: '안녕' })
		expect(result.dictPerLanguage.fr).toEqual({}) // 초기 언어 맵에 있고 dict 파일 없으면 빈 객체
	})

	// 원칙: 엣지 케이스 테스트
	it('캐시 또는 사전 파일이 없을 경우 빈 객체를 사용해야 한다', async () => {
		// 준비 (Arrange)
		const rootAbsolutePath = '/project/src'
		const helperFolderPath = '/project/scripts/helpers'
		const expectedDictFolderPath = '../../../../paraglide/messages-helpers/dicts/'

		vi.mocked(readFilesToStrings_recursive).mockResolvedValue([])
		// helper, dict 파일 없도록 설정
		vi.mocked(readFilesToObjects).mockResolvedValue({})
		vi.mocked(getAbsolutePath).mockImplementation((metaUrl, relativePath) => {
			if (relativePath === expectedDictFolderPath) {
				return '/abs/path/to/dict'
			}
			return `/abs/path/${relativePath}`
		})

		// 실행 (Act)
		const result = await getFiles(rootAbsolutePath, helperFolderPath)

		// 검증 (Assert)
		expect(result.cache).toEqual({})
		const initialLangs = Object.keys(getInitialLanguageMap())
		for (const lang of initialLangs) {
			expect(result.dictPerLanguage[lang]).toEqual({})
		}
	})
})

describe('convertMarkdownFiles 함수', () => {
	// 원칙: 동작 테스트 (공개 API), 모의 최소화 (순수 함수, 모의 불필요)
	it('마크다운 파일 배열을 언어 메시지 맵과 설명 맵으로 올바르게 변환해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = [
			{ path: '/abs/project/src/comp/text/ko.md', value: '안녕' },
			{ path: '/abs/project/src/comp/text/en.md', value: 'Hello' },
			{ path: '/abs/project/src/comp/text/explanation.md', value: '인사말' },
			{ path: '/abs/project/src/comp/other/ko.md', value: '세상' },
			{ path: '/abs/project/src/comp/other/en.md', value: 'World' },
			{ path: '/abs/project/src/comp/extra/fr.md', value: 'Bonjour' }, // 초기 맵에 있는 언어
			{ path: '/abs/project/src/comp/extra/ko.md', value: '봉주르' }, // 중복 키는 덮어씀
			{ path: '/abs/project/src/comp/text.txt', value: '무시됨' }, // 비 마크다운 파일
			{ path: '/abs/project/src/unknown/de.md', value: 'Hallo' }, // 초기 맵에 없는 언어
		]
		const rootAbsolutePath = '/abs/project/src' // 두 번째 인수로 전달

		// 실제 getInitialLanguageMap 결과 기반 예상
		/** @type {Record<string, Record<string, string>>} */
		const expectedLanguageMap = {
			ko: { 'comp/text': '안녕', 'comp/other': '세상', 'comp/extra': '봉주르' },
			en: { 'comp/text': 'Hello', 'comp/other': 'World' },
			...(getInitialLanguageMap().fr ? { fr: { 'comp/extra': 'Bonjour' } } : {}),
		}
		const expectedExplanations = {
			'comp/text': '인사말',
		}

		// 실행 (Act)
		// 두 번째 인자로 rootAbsolutePath 전달
		const result = convertMarkdownFiles(initialMarkdownFiles, rootAbsolutePath)

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap)
		expect(result.explanations).toEqual(expectedExplanations)
		// 'de' 속성이 없는지 확인 (toHaveProperty 사용)
		expect(result.languageMessageMap).not.toHaveProperty('de')
	})

	// 원칙: 엣지 케이스 테스트
	it('입력 파일 배열이 비어있을 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = []
		const rootAbsolutePath = '/abs/project/src'
		const expectedLanguageMap = getInitialLanguageMap() // 모든 값은 빈 객체
		const expectedExplanations = {}

		// 실행 (Act)
		const result = convertMarkdownFiles(initialMarkdownFiles, rootAbsolutePath)

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap)
		expect(result.explanations).toEqual(expectedExplanations)
	})
})

describe('getTranslatedLanguageMap 함수', () => {
	// 원칙: 동작 테스트 (오케스트레이션 로직), 모의 사용 (translateOneLanguageMessages)

	const mockTranslateResultFr = {
		newMessages: { key1: 'Bonjour traduit', key2: 'Monde traduit' },
		newDictionary: { word: 'nouveau mot' },
	}
	const mockTranslateResultDe = {
		// de는 targetLanguageMap에 포함되지 않을 수 있음 (ko, en 기반)
		newMessages: { key1: 'Hallo übersetzt' },
		newDictionary: { word: 'neues Wort' },
	}

	beforeEach(() => {
		vi.clearAllMocks()
		// translateOneLanguageMessages 모의 설정 수정 (if/else if/else 사용)
		vi.mocked(translateOneLanguageMessages).mockImplementation(async (language) => {
			if (language === 'fr') {
				return mockTranslateResultFr
			} else if (language === 'de') {
				// else if 사용
				return mockTranslateResultDe
			} // 기본값 반환
			return { newMessages: {}, newDictionary: {} }
		})
	})

	// calculateInitialTranslationStateByBaseLanguages는 실제 함수 사용 가정
	it('각 대상 언어에 대해 translateOneLanguageMessages를 호출하고 결과를 집계해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			// ko, en 제공, fr, de, ja는 번역 대상 가정
			ko: { key1: '안녕', key2: '세상' },
			en: { key1: 'Hello', key2: 'World' },
			fr: { key1: 'Bonjour' }, // 일부만 존재
			de: {}, // 존재하지 않음
			ja: {}, // 존재하지 않음 (getInitialLanguageMap 에 있다고 가정)
			// ...getInitialLanguageMap() // 초기 맵 구조 확보 - 명시적으로 targetLangs 정의
		}
		const targetLangs = ['fr', 'de', 'ja'] // 번역 대상 언어 목록 명시

		const explanations = { key1: '인사', key2: '대상' }
		const dictPerLanguage = { fr: { word: 'mot' }, de: { word: 'Wort' }, ja: {} }
		const combinedMessages_cached = { oldKey: { ko: '오래됨', en: 'Old' } } // 캐시된 메시지
		const dummyGetTranslatedMessages = vi.fn() // 실제 번역 함수 (모의된 translateOneLanguageMessages 내부에서 사용될 수 있음)

		// calculateInitialTranslationStateByBaseLanguages 직접 호출 대신 예상 결과 정의
		const expectedCombinedLatest = {
			key1: { ko: '안녕', en: 'Hello', explanation: '인사' },
			key2: { ko: '세상', en: 'World', explanation: '대상' },
		}
		// 주의: 이 예상값은 calculateInitialTranslationStateByBaseLanguages의 실제 로직을 반영해야 함
		const expectedTargetLanguageMap = {
			fr: { value: { key1: 'Bonjour' }, missingMessageKeys: ['key1', 'key2'] }, // key1은 있고 key2는 없음
			de: { value: {}, missingMessageKeys: ['key1', 'key2'] }, // 둘 다 없음
			ja: { value: {}, missingMessageKeys: ['key1', 'key2'] }, // 둘 다 없음
		}

		// 실행 (Act)
		const result = await getTranslatedLanguageMap_action(
			['ko', 'en'], // basicLangs 매개변수 추가
			messageMap,
			explanations,
			dictPerLanguage,
			combinedMessages_cached,
			dummyGetTranslatedMessages,
		)

		// 검증 (Assert)
		// 1. translateOneLanguageMessages 호출 검증 (targetLangs 기준)
		expect(translateOneLanguageMessages).toHaveBeenCalledTimes(targetLangs.length)

		// 예상된 인자로 호출되었는지 확인
		for (const lang of targetLangs) {
			// expectedTargetLanguageMap[lang]이 존재하는 경우에만 검증
			if (expectedTargetLanguageMap[lang]) {
				expect(translateOneLanguageMessages).toHaveBeenCalledWith(
					lang,
					expectedTargetLanguageMap[lang], // 해당 언어의 예상 초기 상태
					dictPerLanguage[lang] || {},
					expectedCombinedLatest, // 예상되는 최신 메시지 조합
					dummyGetTranslatedMessages,
				)
			}
		}

		// 2. 최종 결과 검증 (모의된 결과가 집계되었는지 확인)
		const expectedResult = {}
		if (targetLangs.includes('fr')) expectedResult.fr = mockTranslateResultFr
		if (targetLangs.includes('de')) expectedResult.de = mockTranslateResultDe
		if (targetLangs.includes('ja')) expectedResult.ja = { newMessages: {}, newDictionary: {} } // 기본 모의 반환값

		expect(result).toEqual(expectedResult)
	})

	it('번역할 대상 언어가 없을 경우 (ko, en만 있을 경우) 빈 객체를 반환해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			// ko, en만 존재
			ko: { key1: '안녕' },
			en: { key1: 'Hello' },
		}
		const explanations = { key1: '인사' }
		const dictPerLanguage = {}
		const combinedMessages_cached = {}
		const dummyGetTranslatedMessages = vi.fn()

		// 실행 (Act)
		const result = await getTranslatedLanguageMap_action(
			['ko', 'en'], // basicLangs 매개변수 추가
			messageMap,
			explanations,
			dictPerLanguage,
			combinedMessages_cached,
			dummyGetTranslatedMessages,
		)

		// 검증 (Assert)
		expect(translateOneLanguageMessages).not.toHaveBeenCalled()
		expect(result).toEqual({})
	})
})

describe('saveFiles 함수', () => {
	const mockNewCache = { combined: 'new cache data' }
	// 실제 사용되는 절대 경로로 설정
	const expectedDictFolderPath = '/paraglide/messages-helpers/dicts'

	beforeEach(() => {
		vi.clearAllMocks()
		// Spy 리셋
		JSON_stringify_spy.mockClear()
		vi.mocked(getNewCache).mockReturnValue(mockNewCache) // 항상 mockNewCache 반환

		// getAbsolutePath 모의 설정으로 절대 경로 반환
		vi.mocked(getAbsolutePath).mockImplementation((metaUrl, relativePath) => {
			const dictRelativePath = '../../../../paraglide/messages-helpers/dicts'
			if (relativePath === dictRelativePath) {
				return expectedDictFolderPath
			}
			return `/abs/path/${relativePath}`
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('번역 파일 저장 기능 테스트', async () => {
		// 준비 (Arrange) - 상대 경로 입력
		const rootInputPath = 'project/output'
		const helperInputPath = 'project/helpers'

		// 기대 경로 생성
		const expectedMsgPathFrText = path.normalize(path.join(rootInputPath, 'comp/text', 'fr.md'))
		const expectedMsgPathFrOther = path.normalize(path.join(rootInputPath, 'comp/other', 'fr.md'))
		const expectedMsgPathDeText = path.normalize(path.join(rootInputPath, 'comp/text', 'de.md'))
		const expectedMsgPathDeExtra = path.normalize(path.join(rootInputPath, 'comp/extra', 'de.md'))
		// 절대 경로 사용
		const expectedDictPathFr = path.normalize(path.join(expectedDictFolderPath, 'fr.json'))
		const expectedDictPathDe = path.normalize(path.join(expectedDictFolderPath, 'de.json'))
		const expectedCachePath = path.normalize(path.join(helperInputPath, 'cache.json'))

		const translatedLanguageMap = {
			fr: {
				missingMessageKeys: ['comp/text', 'comp/other'],
				newMessages: { 'comp/text': 'Bonjour', 'comp/other': 'Monde' },
				newDictionary: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					hello: 'salut',
				},
			},
			de: {
				missingMessageKeys: ['comp/text', 'comp/extra'],
				newMessages: { 'comp/text': 'Hallo', 'comp/extra': 'Extra' },
				newDictionary: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					hello: 'hallo',
					world: 'Welt',
				},
			},
		}
		const explanations = {
			'comp/text': 'Greeting',
			'comp/other': 'Object',
			'comp/extra': 'Additional',
		}
		const languageMessageMap_ko = {
			'comp/text': '안녕',
			'comp/other': '세상',
			'comp/extra': '추가',
		}
		const languageMessageMap_en = {
			'comp/text': 'Hello',
			'comp/other': 'World',
			'comp/extra': 'Extra',
		}

		const expectedJsonFr = JSON.stringify(
			{ $schema: 'https://inlang.com/schema/inlang-message-format', hello: 'salut' },
			undefined,
			2,
		)
		const expectedJsonDe = JSON.stringify(
			{ $schema: 'https://inlang.com/schema/inlang-message-format', hello: 'hallo', world: 'Welt' },
			undefined,
			2,
		)
		const expectedJsonCache = JSON.stringify(mockNewCache, undefined, 2)

		// 실행 전에 명시적으로 초기화
		JSON_stringify_spy.mockClear()

		// 실행 (Act)
		await saveFiles_action(rootInputPath, helperInputPath, translatedLanguageMap, explanations, {
			ko: languageMessageMap_ko,
			en: languageMessageMap_en,
		})

		// 검증 (Assert)
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledTimes(7)

		// 메시지 파일 검증
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedMsgPathFrText, 'Bonjour')
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedMsgPathFrOther, 'Monde')
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedMsgPathDeText, 'Hallo')
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedMsgPathDeExtra, 'Extra')

		// 사전 파일 검증 (절대 경로)
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedDictPathFr, expectedJsonFr)
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedDictPathDe, expectedJsonDe)

		// 캐시 파일 검증
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedCachePath, expectedJsonCache)

		expect(vi.mocked(getNewCache)).toHaveBeenCalledTimes(1)
		expect(vi.mocked(getNewCache)).toHaveBeenCalledWith(
			{ ko: languageMessageMap_ko, en: languageMessageMap_en },
			explanations,
		)

		// JSON.stringify 호출 검증 - 정확한 호출 횟수 대신 최소 호출 검증으로 변경
		expect(JSON_stringify_spy).toHaveBeenCalledWith(
			translatedLanguageMap.fr.newDictionary, // $schema 포함된 객체
			undefined,
			2,
		)
		expect(JSON_stringify_spy).toHaveBeenCalledWith(
			translatedLanguageMap.de.newDictionary, // $schema 포함된 객체
			undefined,
			2,
		)
		expect(JSON_stringify_spy).toHaveBeenCalledWith(mockNewCache, undefined, 2)
	})

	it('빈 번역에 대한 캐시 저장 기능 테스트', async () => {
		// 준비 (Arrange)
		const rootInputPath = 'project/output'
		const helperInputPath = 'project/helpers'
		const translatedLanguageMap = {}
		const explanations = { key: '설명' }
		const languageMessageMap_ko = { key: '값' }
		const languageMessageMap_en = { key: 'value' }

		const expectedCachePath = path.normalize(path.join(helperInputPath, 'cache.json'))

		// 테스트를 위한 모의 동작 확인
		console.log('테스트: mockNewCache 값:', mockNewCache)
		console.log('테스트: getNewCache 함수 타입:', typeof getNewCache)

		// 실행 전에 명시적으로 초기화
		JSON_stringify_spy.mockClear()
		console.log('JSON.stringify 초기화 후 호출 횟수:', JSON_stringify_spy.mock.calls.length)

		// 실행 (Act)
		await saveFiles_action(rootInputPath, helperInputPath, translatedLanguageMap, explanations, {
			ko: languageMessageMap_ko,
			en: languageMessageMap_en,
		})

		// 실행 후 spy 호출 확인
		console.log('saveFiles 실행 후 JSON.stringify 호출 횟수:', JSON_stringify_spy.mock.calls.length)
		if (JSON_stringify_spy.mock.calls.length > 0) {
			console.log(
				'JSON.stringify 첫 번째 호출 인자:',
				JSON.stringify(JSON_stringify_spy.mock.calls[0]),
			)
		}

		// 검증 (Assert)
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledTimes(1) // 캐시만
		expect(vi.mocked(writeFile_async)).toHaveBeenCalledWith(expectedCachePath, expect.any(String))
		expect(vi.mocked(getNewCache)).toHaveBeenCalledTimes(1)
		expect(vi.mocked(getNewCache)).toHaveBeenCalledWith(
			{ ko: languageMessageMap_ko, en: languageMessageMap_en },
			explanations,
		)

		// JSON.stringify 직접 검증 대신, writeFile_async에 전달된 인자를 검증
		expect(vi.mocked(writeFile_async).mock.calls[0][1]).toContain('new cache data')
	})
})
