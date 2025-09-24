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
		getNewCache: vi.fn(() => ({ combined: 'new cache data' })), // 기본 반환값 설정
		translateOneLanguageMessages: vi.fn(),
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
import { convertMarkdownFiles, getFiles, getTranslatedLanguageMap_action } from './translation.js'

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
		const mockMarkdownFiles = [{ fileName: 'ko.md', path: markdownPath, value: '안녕' }] // fileName 추가
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
	it('마크다운 파일 배열과 Supabase 마크다운 리스트를 언어 메시지 맵과 설명 맵으로 올바르게 변환해야 한다', () => {
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

		// Supabase에서 가져온 마크다운 리스트 추가
		const markdownListFromSupabase = [
			{ body: 'Supabase Hello', key: 'supabase/key1', locale: 'en' },
			{ body: 'Supabase 안녕', key: 'supabase/key1', locale: 'ko' },
			{ body: 'Supabase Bonjour', key: 'supabase/key2', locale: 'fr' },
		]

		// 실제 getInitialLanguageMap 결과 기반 예상
		/** @type {Record<string, Record<string, string>>} */
		const expectedLanguageMap = {
			en: {
				'comp/other': 'World',
				'comp/text': 'Hello',
				'supabase/key1': 'Supabase Hello',
			},
			ko: {
				'comp/extra': '봉주르',
				'comp/other': '세상',
				'comp/text': '안녕',
				'supabase/key1': 'Supabase 안녕',
			},
			...(getInitialLanguageMap().fr ?
				{
					fr: {
						'comp/extra': 'Bonjour',
						'supabase/key2': 'Supabase Bonjour',
					},
				}
			:	{}),
		}
		const expectedExplanations = {
			'comp/text': '인사말',
		}

		// 실행 (Act)
		// 세 번째 인자로 markdownListFromSupabase 전달
		const result = convertMarkdownFiles(
			initialMarkdownFiles,
			rootAbsolutePath,
			markdownListFromSupabase,
		)

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap)
		expect(result.explanations).toEqual(expectedExplanations)
		// 'de' 속성이 없는지 확인 (toHaveProperty 사용)
		expect(result.languageMessageMap).not.toHaveProperty('de')
	})

	it('Supabase 마크다운 리스트가 없을 경우 기존 로직만 동작해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = [
			{ path: '/abs/project/src/comp/text/ko.md', value: '안녕' },
			{ path: '/abs/project/src/comp/text/en.md', value: 'Hello' },
			{ path: '/abs/project/src/comp/text/explanation.md', value: '인사말' },
		]
		const rootAbsolutePath = '/abs/project/src'
		const markdownListFromSupabase = [] // 빈 배열

		// 실제 getInitialLanguageMap 결과 기반 예상
		/** @type {Record<string, Record<string, string>>} */
		const expectedLanguageMap = {
			en: { 'comp/text': 'Hello' },
			ko: { 'comp/text': '안녕' },
			...(getInitialLanguageMap().fr ? { fr: {} } : {}),
		}
		const expectedExplanations = {
			'comp/text': '인사말',
		}

		// 실행 (Act)
		const result = convertMarkdownFiles(
			initialMarkdownFiles,
			rootAbsolutePath,
			markdownListFromSupabase,
		)

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap)
		expect(result.explanations).toEqual(expectedExplanations)
	})

	// 원칙: 엣지 케이스 테스트
	it('입력 파일 배열이 비어있을 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = []
		const rootAbsolutePath = '/abs/project/src'
		const markdownListFromSupabase = []
		const expectedLanguageMap = getInitialLanguageMap() // 모든 값은 빈 객체
		const expectedExplanations = {}

		// 실행 (Act)
		const result = convertMarkdownFiles(
			initialMarkdownFiles,
			rootAbsolutePath,
			markdownListFromSupabase,
		)

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap)
		expect(result.explanations).toEqual(expectedExplanations)
	})
})

describe('getTranslatedLanguageMap 함수', () => {
	// 원칙: 동작 테스트 (오케스트레이션 로직), 모의 사용 (translateOneLanguageMessages)

	const mockTranslateResultFr = {
		newDictionary: { word: 'nouveau mot' },
		newMessages: { key1: 'Bonjour traduit', key2: 'Monde traduit' },
	}
	const mockTranslateResultDe = {
		// de는 targetLanguageMap에 포함되지 않을 수 있음 (ko, en 기반)
		newDictionary: { word: 'neues Wort' },
		newMessages: { key1: 'Hallo übersetzt' },
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
			return { newDictionary: {}, newMessages: {} }
		})
	})

	// calculateInitialTranslationStateByBaseLanguages는 실제 함수 사용 가정
	it('각 대상 언어에 대해 translateOneLanguageMessages를 호출하고 결과를 집계해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			// ko, en 제공, fr, de, ja는 번역 대상 가정
			de: {}, // 존재하지 않음
			en: { key1: 'Hello', key2: 'World' },
			fr: { key1: 'Bonjour' }, // 일부만 존재
			ja: {}, // 존재하지 않음 (getInitialLanguageMap 에 있다고 가정)
			ko: { key1: '안녕', key2: '세상' },
			// ...getInitialLanguageMap() // 초기 맵 구조 확보 - 명시적으로 targetLangs 정의
		}
		const targetLangs = ['fr', 'de', 'ja'] // 번역 대상 언어 목록 명시

		const explanations = { key1: '인사', key2: '대상' }
		const dictPerLanguage = { de: { word: 'Wort' }, fr: { word: 'mot' }, ja: {} }
		const combinedMessages_cached = { oldKey: { en: 'Old', ko: '오래됨' } } // 캐시된 메시지
		const dummyGetTranslatedMessages = vi.fn() // 실제 번역 함수 (모의된 translateOneLanguageMessages 내부에서 사용될 수 있음)

		// calculateInitialTranslationStateByBaseLanguages 직접 호출 대신 예상 결과 정의
		const expectedCombinedLatest = {
			key1: { en: 'Hello', explanation: '인사', ko: '안녕' },
			key2: { en: 'World', explanation: '대상', ko: '세상' },
		}
		// 주의: 이 예상값은 calculateInitialTranslationStateByBaseLanguages의 실제 로직을 반영해야 함
		const expectedTargetLanguageMap = {
			de: { missingMessageKeys: ['key1', 'key2'], value: {} }, // 둘 다 없음
			fr: { missingMessageKeys: ['key1', 'key2'], value: { key1: 'Bonjour' } }, // key1은 있고 key2는 없음
			ja: { missingMessageKeys: ['key1', 'key2'], value: {} }, // 둘 다 없음
		}

		// 실행 (Act)
		const result = await getTranslatedLanguageMap_action(
			['ko', 'en'], // baseLocales 매개변수 추가
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
		if (targetLangs.includes('ja')) expectedResult.ja = { newDictionary: {}, newMessages: {} } // 기본 모의 반환값

		expect(result).toEqual(expectedResult)
	})

	it('번역할 대상 언어가 없을 경우 (ko, en만 있을 경우) 빈 객체를 반환해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			// ko, en만 존재
			en: { key1: 'Hello' },
			ko: { key1: '안녕' },
		}
		const explanations = { key1: '인사' }
		const dictPerLanguage = {}
		const combinedMessages_cached = {}
		const dummyGetTranslatedMessages = vi.fn()

		// 실행 (Act)
		const result = await getTranslatedLanguageMap_action(
			['ko', 'en'], // baseLocales 매개변수 추가
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
