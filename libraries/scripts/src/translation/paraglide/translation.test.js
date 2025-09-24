import path from 'node:path'

import { normalizeString, getSimpleHash } from '@library/helpers/functions'
import { R } from '@library/helpers/R'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// 테스트 대상 모듈
import { getFiles, getTranslatedLanguageMap, saveFiles } from './translation.js'

// helpers.js의 함수들은 실제 구현을 사용합니다 (원칙: 모의 최소화 - 순수 함수 및 내부 로직)
// 이들은 translation.js의 함수들에 의해 간접적으로 테스트됩니다.

// 모의 처리할 모듈 (원칙: 최후 수단 모의 - 파일 시스템 I/O 격리)
vi.mock('@library/helpers/fs-async', () => ({
	readFilesToObjects: vi.fn(),
	writeFile_async: vi.fn(),
}))

// 전역 변수 모의 (필요하다면)
// const mockMessageFolderPath = '/mock/paraglide/messages/' // 이제 직접 경로 사용
// const mockHelperFolderPath = '/mock/paraglide/messages-helpers/'
// const mockDictFolderPath = '/mock/paraglide/messages-helpers/dicts/'

// @library/helpers/fs-sync 모의 처리를 vi.doMock으로 변경 시도
// vi.hoisted는 더 이상 필요 없음
// const fsSyncMocks = vi.hoisted(() => { ... });

vi.mock('@library/helpers/fs-sync', () => {
	console.log('[doMock Attempt] Mocking @library/helpers/fs-sync')
	return {
		getAbsolutePath: vi.fn((importMetaUrl, relativePath) => {
			console.log(
				`[doMock] mockGetAbsolutePath called with: importMetaUrl=${importMetaUrl}, relativePath=${relativePath}`,
			)
			if (typeof relativePath === 'string' && relativePath.includes('messages-helpers/dicts')) {
				return '/mock/paraglide/messages-helpers/dicts/'
			}
			if (typeof relativePath === 'string' && relativePath.includes('messages-helpers/')) {
				return '/mock/paraglide/messages-helpers/'
			}
			if (typeof relativePath === 'string' && relativePath.includes('messages/')) {
				return '/mock/paraglide/messages/'
			}
			return '/mock/paraglide/default_path'
		}),
		// 만약 @library/helpers/fs-sync가 default export를 사용한다면,
		// default: { getAbsolutePath: vi.fn(...) }
		// 와 같이 수정해야 할 수 있습니다.
	}
})

// 테스트용 getTranslatedMessages 함수 (원칙: 최후 수단 모의 - 외부 서비스/함수 의존성 제어)
const mockGetTranslatedMessages = vi.fn()

// helpers.js의 함수 중 getInitialLanguageMap만 모의 처리
// 다른 함수들은 실제 구현을 사용 (원칙: 모의 최소화)
const helpersMocks = vi.hoisted(() => {
	console.log('[Hoisted Setup] Defining mockGetInitialLanguageMap')
	return {
		mockGetInitialLanguageMap: vi.fn(() => ({
			en: {},
			ko: {},
			ja: {},
		})),
	}
})

vi.mock('../helpers.js', async () => {
	console.log('[Mocking Helpers] Applying mock for ../helpers.js')
	const actualHelpers = await vi.importActual('../helpers.js')
	return {
		...actualHelpers,
		// vi.hoisted에서 생성된 mockGetInitialLanguageMap 참조
		getInitialLanguageMap: helpersMocks.mockGetInitialLanguageMap,
	}
})

describe('Paraglide 번역 스크립트', () => {
	// fs-async 모의 함수 가져오기
	let readFilesToObjects
	let writeFile_async
	beforeEach(async () => {
		const fsAsync = await import('@library/helpers/fs-async')
		readFilesToObjects = fsAsync.readFilesToObjects
		writeFile_async = fsAsync.writeFile_async

		vi.clearAllMocks() // 각 테스트 전에 모든 모의 초기화 (원칙: 테스트 격리)

		// mockGetTranslatedMessages 기본 모의 구현 설정
		mockGetTranslatedMessages.mockImplementation(
			async (language, languageMessage, dictionary, combinedMessages) => {
				// 기본적으로는 입력 메시지를 그대로 반환하고, 새 사전은 비어있도록 설정
				const translatedMessages = {}
				for (const key of languageMessage.missingMessageKeys) {
					translatedMessages[key] = `translated_${key}_for_${language}`
				}
				return {
					translatedMessages,
					newDictionary: { ...dictionary }, // 입력 사전 복사 또는 수정
					// newMessages는 translateOneLanguageMessages 내부에서 계산되므로 여기서는 반환 안 함
				}
			},
		)
	})

	afterEach(() => {
		vi.restoreAllMocks() // 모든 모의 상태 복원
	})

	describe('getFiles 함수', () => {
		// 원칙: 동작 테스트 (공개 API), 모의 최소화 (fs-async 및 getInitialLanguageMap만 모의)
		it('메시지, 헬퍼, 사전 파일을 올바르게 읽고 스키마를 제외해야 한다', async () => {
			// 준비 (Arrange)
			helpersMocks.mockGetInitialLanguageMap.mockReturnValueOnce({
				// 이 테스트를 위한 특정 반환 값 설정
				en: {},
				ko: {},
				ja: {},
				// 필요한 경우 더 많은 언어 추가
			})
			readFilesToObjects
				.mockResolvedValueOnce({
					// messageFolderPath
					'ko.json': { $schema: 'schema', a: '안녕', b: '세계' },
					'en.json': { $schema: 'schema', a: 'Hello' },
				})
				.mockResolvedValueOnce({
					// helperFolderPath
					'explanations.json': { $schema: 'schema', a: 'Greeting' },
					'cache.json': { $schema: 'schema', c: 'Cached' },
				})
				.mockResolvedValueOnce({
					// dictFolderPath
					'ko.json': { a_word: '단어' },
				})

			// 실행 (Act)
			const result = await getFiles()

			// 검증 (Assert)
			expect(helpersMocks.mockGetInitialLanguageMap).toHaveBeenCalled() // 모의 함수 호출 확인
			expect(readFilesToObjects).toHaveBeenCalledTimes(3)
			expect(readFilesToObjects).toHaveBeenNthCalledWith(1, '/mock/paraglide/messages/')
			expect(readFilesToObjects).toHaveBeenNthCalledWith(2, '/mock/paraglide/messages-helpers/')
			expect(readFilesToObjects).toHaveBeenNthCalledWith(
				3,
				'/mock/paraglide/messages-helpers/dicts/',
			)

			expect(result.languageMessageMap.ko).toEqual({ a: '안녕', b: '세계' })
			expect(result.languageMessageMap.en).toEqual({ a: 'Hello' })
			expect(result.languageMessageMap.ja).toEqual({}) // 없는 파일은 빈 객체
			expect(result.explanations).toEqual({ a: 'Greeting' })
			expect(result.cache).toEqual({ c: 'Cached' })
			expect(result.dictPerLanguage.ko).toEqual({ a_word: '단어' })
			expect(result.dictPerLanguage.en).toEqual({}) // 없는 파일은 빈 객체
		})

		// 원칙: 엣지 케이스 테스트
		it('특정 파일이 누락된 경우 기본값을 사용해야 한다', async () => {
			// 준비 (Arrange)
			helpersMocks.mockGetInitialLanguageMap.mockReturnValueOnce({
				// 이 테스트를 위한 특정 반환 값 설정
				en: {},
				ko: {},
				ja: {}, // 'ja' 속성 추가하여 린터 오류 해결
			})
			readFilesToObjects
				.mockResolvedValueOnce({ 'ko.json': { a: '안녕' } }) // messages
				.mockResolvedValueOnce({}) // helpers (explanations, cache 없음)
				.mockResolvedValueOnce({}) // dicts (ko.json 없음)

			// 실행 (Act)
			const result = await getFiles()

			// 검증 (Assert)
			expect(helpersMocks.mockGetInitialLanguageMap).toHaveBeenCalled()
			expect(result.languageMessageMap.ko).toEqual({ a: '안녕' })
			expect(result.explanations).toEqual({})
			expect(result.cache).toEqual({})
			expect(result.dictPerLanguage.ko).toEqual({})
		})
	})

	describe('getTranslatedLanguageMap 함수', () => {
		const baseLanguageMessageMap = {
			ko: { msg1: '한글1', msg2: '한글2' },
			en: { msg1: 'English1' },
			ja: { msg1: '日本語1' },
		}
		const baseExplanations = { msg1: 'Expl1', msg2: 'Expl2' }
		const baseDictPerLanguage = {
			ko: { term1: '용어1' },
			en: { term1: 'Term1' },
			ja: {},
		}
		const baseCombinedMessagesCached = {
			msg_cached: { ko: '캐시된 한글', explanation: '캐시설명' },
		}

		// 원칙: 동작 테스트 (공개 API), 모의 최소화 (getTranslatedMessages만 모의)
		it('영어 메시지가 없으면 오류를 발생시켜야 한다', async () => {
			// 준비 (Arrange)
			const languageMessageMapWithoutEn = R.omit('en')(baseLanguageMessageMap)
			console.log('💬 it languageMessageMapWithoutEn:', languageMessageMapWithoutEn)

			// 실행 (Act) & 검증 (Assert)
			await expect(
				getTranslatedLanguageMap(
					languageMessageMapWithoutEn,
					baseExplanations,
					baseDictPerLanguage,
					baseCombinedMessagesCached,
					mockGetTranslatedMessages,
				),
			).rejects.toThrow(
				"English ('en') messages not found in messageMap. Skipping English pre-translation.",
			)
		})

		// 원칙: 동작 테스트
		it('영어 및 다른 언어에 대한 번역 흐름을 올바르게 처리해야 한다', async () => {
			// 준비 (Arrange)
			// helpers.js의 generateKeyNumberFunctions 모의가 필요.
			// 여기서는 간단히 { msg1: v1, msg2: v2 } -> { 1: v1, 2: v2 } 로 변환된다고 가정. (실제로는 키 순서에 따라 다를 수 있음)
			// restoreFromNumberKeys는 그 반대로.

			// 1. calculateInitialTranslationStateByBaseLanguages 결과 예상:
			// combinedMessages_latest = { msg1: { ko: '한글1', explanation: 'Expl1' }, msg2: { ko: '한글2', explanation: 'Expl2' } }
			// targetLanguageMap.en = { value: { msg1: 'English1' }, missingMessageKeys: ['msg1', 'msg2'] }
			//   (msg1은 cached에 없거나 달라서, msg2는 en.value에 없어서 missing)
			// targetLanguageMap.ja = { value: { msg1: '日本語1' }, missingMessageKeys: ['msg1', 'msg2'] }

			mockGetTranslatedMessages
				.mockImplementationOnce(async (lang, numberedPayload, olderMsgs, dict) => {
					// 영어 번역 모의
					expect(lang).toBe('en')
					// prepareTranslationPayload(targetLanguageMap.en, combinedMessages_latest) 결과 예상:
					// combinedMessages_target = { msg1: {ko:'한글1',exp:'Expl1'}, msg2: {ko:'한글2',exp:'Expl2'} }
					// numberedPayload = { 1: {ko:'한글1',exp:'Expl1'}, 2: {ko:'한글2',exp:'Expl2'} } (msg1, msg2 순서 가정)
					// olderMsgs = [] (targetLanguageMap.en.value.msg1이 missingKey 'msg1'에 해당하므로 older가 아님)
					expect(numberedPayload).toEqual({
						1: { ko: '한글1', explanation: 'Expl1' },
						2: { ko: '한글2', explanation: 'Expl2' },
					})
					expect(olderMsgs).toEqual([])
					// translatedMessages는 숫자키로 반환
					return {
						translatedMessages: {
							1: 'Translated_English_msg1_#KEY#',
							2: 'Translated_English_msg2_#KEY#',
						},
						newDictionary: { ...dict, newEnTerm: 'NewEn' },
					}
				})
				.mockImplementationOnce(async (lang, numberedPayload, olderMsgs, dict) => {
					// 일본어 번역 모의
					expect(lang).toBe('ja')
					// prepareTranslationPayload(targetLanguageMap.ja, combinedMessages_latest_withEn) 결과 예상:
					// combinedMessages_latest_withEn.msg2에 en 번역 추가됨
					// combinedMessages_target = { msg1: {ko:'한글1',exp:'Expl1'}, msg2: {ko:'한글2',exp:'Expl2', en: 'Translated_English_msg2_#KEY#'} }
					// numberedPayload = { 1: {ko:'한글1',exp:'Expl1'}, 2: {ko:'한글2',exp:'Expl2', en: 'Translated_English_msg2_#KEY#'} }
					// olderMsgs = []
					expect(numberedPayload).toEqual({
						1: { ko: '한글1', explanation: 'Expl1', en: 'Translated_English_msg1_#KEY#' },
						2: { ko: '한글2', explanation: 'Expl2', en: 'Translated_English_msg2_#KEY#' },
					})
					expect(olderMsgs).toEqual([])
					return {
						translatedMessages: { 1: '翻訳された_msg1_#KEY#', 2: '翻訳された_msg2_#KEY#' },
						newDictionary: { ...dict, newJaTerm: 'NewJa' },
					}
				})

			const result = await getTranslatedLanguageMap(
				baseLanguageMessageMap,
				baseExplanations,
				baseDictPerLanguage,
				baseCombinedMessagesCached,
				mockGetTranslatedMessages,
			)

			// 검증 (Assert)
			expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(2) // en, ja

			// 영어 결과 검증
			// integrateTranslatedMessages는 { 2: 'Translated_English_msg2_#KEY#' } 를 { msg2: 'Translated_English_msg2_#KEY#' } 로 복원 가정
			expect(result.en.translatedMessages).toEqual({
				msg1: 'Translated_English_msg1_#KEY#',
				msg2: 'Translated_English_msg2_#KEY#',
			})
			console.log('💬 it result:', result)
			expect(result.en.newDictionary).toEqual({ term1: 'Term1', newEnTerm: 'NewEn' })
			expect(result.en.newMessages).toEqual({
				msg1: 'Translated_English_msg1_#KEY#',
				msg2: 'Translated_English_msg2_#KEY#',
			})

			// 일본어 결과 검증
			expect(result.ja.translatedMessages).toEqual({
				msg1: '翻訳された_msg1_#KEY#',
				msg2: '翻訳された_msg2_#KEY#',
			})
			expect(result.ja.newDictionary).toEqual({ newJaTerm: 'NewJa' })
			expect(result.ja.newMessages).toEqual({
				msg1: '翻訳された_msg1_#KEY#',
				msg2: '翻訳された_msg2_#KEY#',
			})

			// ko (baseLanguage)는 targetLanguageMap에 포함되지 않으므로, getTranslatedLanguageMap의 결과에도 없음.
			expect(result.ko).toBeUndefined()
		})

		// 원칙: 엣지 케이스 - 번역할 메시지가 없는 경우
		it('missingMessageKeys가 없는 언어는 번역을 시도하지 않아야 한다', async () => {
			// 준비 (Arrange)
			// 이 테스트의 목표: calculateInitialTranslationStateByBaseLanguages 결과
			// targetLanguageMap.en.missingMessageKeys = []
			// targetLanguageMap.ja.missingMessageKeys = []
			const languageMessageMapForNoMissing = {
				ko: { msg1: '한글1', msg2: '한글2' },
				en: { msg1: 'English1', msg2: 'English2' },
				ja: { msg1: '日本語1', msg2: '日本語2' },
			}
			const explanationsForNoMissing = { msg1: 'Expl1', msg2: 'Expl2' }
			// 캐시된 메시지가 최신 메시지 및 설명과 완전히 일치하고,
			// 각 언어의 메시지 파일(.json)에 모든 키가 존재하면 missingMessageKeys는 비어있게 됨.
			const cachedMessagesForNoMissing = {
				msg1: { ko: '한글1', explanation: 'Expl1' },
				msg2: { ko: '한글2', explanation: 'Expl2' },
			}

			mockGetTranslatedMessages.mockImplementation(
				async (lang, numberedPayload, olderMsgs, dict) => {
					// missingMessageKeys가 [] 이므로, prepareTranslationPayload 결과:
					// numberedPayload는 {}
					// olderMsgs는 해당 언어의 value에 있는 모든 메시지
					expect(numberedPayload).toEqual({})
					if (lang === 'en') {
						expect(olderMsgs).toEqual(['English1', 'English2'])
					} else if (lang === 'ja') {
						expect(olderMsgs).toEqual(['日本語1', '日本語2'])
					}

					return { translatedMessages: {}, newDictionary: { ...dict } } // 번역된 내용 없음
				},
			)

			const result = await getTranslatedLanguageMap(
				languageMessageMapForNoMissing,
				explanationsForNoMissing,
				baseDictPerLanguage, // 사전은 이전 테스트의 것을 사용해도 무방
				cachedMessagesForNoMissing,
				mockGetTranslatedMessages,
			)

			// 검증 (Assert)
			// 영어는 pre-translation 때문에 항상 호출됨.
			// 일본어는 targetLanguageMap에 포함되고 missingMessageKeys가 비어있으므로,
			// translateOneLanguageMessages 내부에서 mockGetTranslatedMessages가 호출됨.
			expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(0)

			// 결과 검증:
			// translateOneLanguageMessages는 missingMessageKeys가 비어있고 번역 결과가 없으면
			// 원래 languageMessageObject (targetLanguageMap의 항목) 에 translatedMessages, newMessages, newDictionary 추가하여 반환.
			// newMessages는 value와 동일.

			console.log('💬 it result:', result)
			console.log('💬 it baseDictPerLanguage:', baseDictPerLanguage)

			expect(result.en.missingMessageKeys).toEqual([])
			expect(result.en.newMessages).toEqual(languageMessageMapForNoMissing.en)
			expect(result.en.newDictionary).toEqual(baseDictPerLanguage.en)

			expect(result.ja.missingMessageKeys).toEqual([])
			expect(result.ja.newMessages).toEqual(languageMessageMapForNoMissing.ja)
			expect(result.ja.newDictionary).toEqual(baseDictPerLanguage.ja)

			// ko는 결과에 없음
			expect(result.ko).toBeUndefined()
		})
	})

	describe('saveFiles 함수', () => {
		const mockTranslatedLanguageMap = {
			en: {
				value: { msg1: 'English1' },
				missingMessageKeys: ['msg2'], // 저장 대상
				translatedMessages: { msg2: 'Translated_English_msg2' },
				newMessages: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					msg1: 'English1',
					msg2: 'Translated_English_msg2',
				},
				newDictionary: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					term_en: 'TermEN',
				},
			},
			ja: {
				value: { msg1: '日本語1' },
				missingMessageKeys: [], // 저장 안 함
				translatedMessages: {},
				newMessages: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					msg1: '日本語1',
				},
				newDictionary: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					term_ja: 'TermJA',
				},
			},
			ko: {
				value: { msg1: '한글1', msg2: '한글2' },
				missingMessageKeys: ['msg3'], // 저장 대상
				translatedMessages: { msg3: '번역된_한글3' },
				newMessages: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					msg1: '한글1',
					msg2: '한글2',
					msg3: '번역된_한글3',
				},
				newDictionary: {
					$schema: 'https://inlang.com/schema/inlang-message-format',
					term_ko: 'TermKO',
				},
			},
		}
		const mockExplanations = { msg1: 'Expl1', msg2: 'Expl2', msg3: 'Expl3' }
		const mockLanguageMessageMapKo = { msg1: '한글1', msg2: '한글2' }

		beforeEach(() => {
			writeFile_async.mockResolvedValue(undefined) // 기본적으로 성공으로 설정
		})

		// 원칙: 동작 테스트 (공개 API), 모의 최소화 (fs-async만 모의)
		it('missingMessageKeys가 있는 언어에 대해서만 메시지와 사전을 저장해야 한다', async () => {
			// 실행 (Act)
			await saveFiles(mockTranslatedLanguageMap, mockExplanations, mockLanguageMessageMapKo)

			// 검증 (Assert)
			// en, ko에 대해서만 writeFile_async 호출 (총 4번: 각 언어별 메시지, 사전)
			expect(writeFile_async).toHaveBeenCalledTimes(4 + 1) // +1은 cache.json

			// 영어 메시지 및 사전 저장 확인
			expect(writeFile_async).toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages/', 'en.json'),
				JSON.stringify(mockTranslatedLanguageMap.en.newMessages, undefined, 2),
			)
			expect(writeFile_async).toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages-helpers/dicts/', 'en.json'),
				JSON.stringify(mockTranslatedLanguageMap.en.newDictionary, undefined, 2),
			)

			// 한국어 메시지 및 사전 저장 확인
			expect(writeFile_async).toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages/', 'ko.json'),
				JSON.stringify(mockTranslatedLanguageMap.ko.newMessages, undefined, 2),
			)
			expect(writeFile_async).toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages-helpers/dicts/', 'ko.json'),
				JSON.stringify(mockTranslatedLanguageMap.ko.newDictionary, undefined, 2),
			)

			// 일본어는 호출되지 않음 (missingMessageKeys가 비어있으므로)
			expect(writeFile_async).not.toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages/', 'ja.json'),
				expect.any(String),
			)
			expect(writeFile_async).not.toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages-helpers/dicts/', 'ja.json'),
				expect.any(String),
			)
		})

		// 원칙: 동작 테스트
		it('새로운 캐시 파일을 올바르게 저장해야 한다', async () => {
			// 준비 (Arrange)
			// getNewCache는 { ko: languageMessageMap_ko }, explanations 를 기반으로 해시된 캐시를 생성
			const expectedNewCache = {
				msg1: { ko: getSimpleHash(normalizeString('한글1')), explanation: getSimpleHash(normalizeString('Expl1')) },
				msg2: { ko: getSimpleHash(normalizeString('한글2')), explanation: getSimpleHash(normalizeString('Expl2')) },
				// msg3은 languageMessageMapKo에 없으므로 캐시에 포함되지 않음
			}

			// 실행 (Act)
			await saveFiles(mockTranslatedLanguageMap, mockExplanations, mockLanguageMessageMapKo)

			// 검증 (Assert)
			expect(writeFile_async).toHaveBeenCalledWith(
				path.join('/mock/paraglide/messages-helpers/', 'cache.json'),
				JSON.stringify(expectedNewCache, undefined, 2),
			)
		})

		// 원칙: 오류 처리 테스트
		it('파일 쓰기 실패 시 오류를 전파해야 한다', async () => {
			// 준비 (Arrange)
			const writeError = new Error('File write failed')
			writeFile_async.mockRejectedValueOnce(writeError) // 첫 번째 쓰기에서 오류 발생

			// 실행 (Act) & 검증 (Assert)
			await expect(
				saveFiles(mockTranslatedLanguageMap, mockExplanations, mockLanguageMessageMapKo),
			).rejects.toThrow(writeError)
		})
	})
})
