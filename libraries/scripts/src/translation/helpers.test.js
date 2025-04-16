// 모의 대상 함수 임포트 (vi.mocked 사용 위해 필요)
import { generateKeyNumberFunctions } from '@library/helpers/helper-functions';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	calculateInitialTranslationStateByBaseLanguages,
	combineEnglishTranslation,
	integrateTranslatedMessages,
	prepareTranslationPayload,
	translateOneLanguageMessages,
} from './helpers'; // 테스트 대상 함수 임포트

// generateKeyNumberFunctions 모의 (필요한 경우)
// 최상위 변수 선언 제거됨: const mockGenerateKeyNumberFunctions = vi.fn();

vi.mock('@library/helpers/helper-functions', () => ({
	// 팩토리 내에서 직접 모의 함수 생성 및 반환
	generateKeyNumberFunctions: vi.fn(),
}));

// Ramda와 mutative는 일반적으로 모의할 필요가 없습니다. 라이브러리의 실제 동작을 테스트합니다.

// 공통 헬퍼 함수 정의 (Linter 규칙 준수)
const mockRestoreSimple = (data) => data; // 간단한 모의 복원 함수
const mockConvertToNumberSimple = (data) => {
	// 간단한 모의 변환 (실제 로직과 다를 수 있음)
	const numbered = {};
	for (const [index, key] of Object.keys(data).entries()) {
		numbered[index + 1] = data[key];
	}
	return numbered;
};

describe('Translation Helpers', () => {
	describe('calculateInitialTranslationStateByBaseLanguages', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		// 원칙: 모의 최소화 (순수 함수이므로 모의 불필요)
		it('기본 언어와 메시지 맵을 기반으로 초기 상태를 올바르게 계산해야 한다', () => {
			// 준비(Arrange)
			const baseLanguage = 'ko';
			const messageMap = {
				ko: { greeting: '안녕하세요', farewell: '안녕히 가세요' },
				en: { greeting: 'Hello' }, // farewell 누락
				ja: {}, // 비어 있음
			};
			const explanations = {
				greeting: '인사말',
			};
			const combinedMessages_cached = {
				greeting: { ko: '안녕하세요', explanation: '인사말_이전' }, // 설명 변경됨
				farewell: { ko: '안녕히 가세요' }, // 캐시에만 존재
			};
			const expectedCombinedMessages_latest = {
				greeting: { ko: '안녕하세요', explanation: '인사말' },
				farewell: { ko: '안녕히 가세요' },
			};
			// 캐시와 비교했을 때 greeting 설명 변경, farewell ko값 동일하나 캐시된 다른 언어 값 없음 -> greeting, farewell 모두 missing 처리 필요 없음 (현재 로직 기반)
			// *수정*: 캐시 비교 로직 확인 필요. 현재 로직은 combinedMessages_latest (ko + explanation) 와 cached 를 비교.
			// greeting: {ko, explanation} vs {ko, explanation_이전} -> 다름 -> missing 추가
			// farewell: {ko} vs {ko} -> 같음 -> missing 추가 안함
			// 또한, 해당 언어에 메시지 자체가 없는 경우도 missing 추가
			// en: greeting 존재, farewell 없음 -> farewell 추가
			// ja: greeting 없음, farewell 없음 -> greeting, farewell 추가
			// 따라서, 캐시 변경 감지로 greeting 추가 + 언어 자체 누락으로 farewell(en), greeting(ja), farewell(ja) 추가
			const expectedTargetLanguageMap_revised = {
				en: { value: { greeting: 'Hello' }, missingMessageKeys: ['greeting', 'farewell'] }, // 캐시 변경 + 언어 누락
				ja: { value: {}, missingMessageKeys: ['greeting', 'farewell'] }, // 캐시 변경(greeting) + 언어 누락(둘 다)
			};

			// 실행(Act)
			const { combinedMessages_latest, targetLanguageMap } =
				calculateInitialTranslationStateByBaseLanguages(
					[baseLanguage],
					messageMap,
					explanations,
					combinedMessages_cached,
				);

			// 검증(Assert)
			expect(combinedMessages_latest).toEqual(expectedCombinedMessages_latest);
			expect(targetLanguageMap).toEqual(expectedTargetLanguageMap_revised);
		});

		// 원칙: 엣지 케이스 테스트 (빈 입력)
		it('빈 messageMap으로 호출 시 올바르게 처리해야 한다', () => {
			// 준비(Arrange)
			const baseLanguage = 'ko';
			const messageMap = {};
			const explanations = {};
			const combinedMessages_cached = {};
			const expectedCombinedMessages_latest = {};
			const expectedTargetLanguageMap = {};

			// 실행(Act)
			const { combinedMessages_latest, targetLanguageMap } =
				calculateInitialTranslationStateByBaseLanguages(
					[baseLanguage],
					messageMap,
					explanations,
					combinedMessages_cached,
				);

			// 검증(Assert)
			expect(combinedMessages_latest).toEqual(expectedCombinedMessages_latest);
			expect(targetLanguageMap).toEqual(expectedTargetLanguageMap);
		});

		// 원칙: 엣지 케이스 테스트 (대상 언어 없음)
		it('기본 언어만 있을 경우 targetLanguageMap이 비어 있어야 한다', () => {
			// 준비(Arrange)
			const baseLanguage = 'ko';
			const messageMap = {
				ko: { greeting: '안녕' },
			};
			const explanations = {};
			const combinedMessages_cached = {};
			const expectedCombinedMessages_latest = {
				greeting: { ko: '안녕' },
			};
			const expectedTargetLanguageMap = {};

			// 실행(Act)
			const { combinedMessages_latest, targetLanguageMap } =
				calculateInitialTranslationStateByBaseLanguages(
					[baseLanguage],
					messageMap,
					explanations,
					combinedMessages_cached,
				);

			// 검증(Assert)
			expect(combinedMessages_latest).toEqual(expectedCombinedMessages_latest);
			expect(targetLanguageMap).toEqual(expectedTargetLanguageMap);
		});
	});

	describe('combineEnglishTranslation', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		it('번역된 영어 메시지를 최신 결합 메시지에 올바르게 통합해야 한다', () => {
			// 준비(Arrange)
			const combinedMessages_latest = {
				greeting: { ko: '안녕하세요', explanation: '인사말' },
				farewell: { ko: '안녕히 가세요' },
			};
			const englishMessageObject_translated = {
				newMessages: {
					greeting: 'Hello',
					farewell: 'Goodbye',
				},
				// 다른 속성들은 이 함수에서 사용되지 않음
			};
			const expectedCombinedMessages = {
				greeting: { en: 'Hello', ko: '안녕하세요', explanation: '인사말' },
				farewell: { en: 'Goodbye', ko: '안녕히 가세요' },
			};

			// 실행(Act)
			const result = combineEnglishTranslation(
				combinedMessages_latest,
				englishMessageObject_translated,
			);

			// 검증(Assert)
			expect(result).toEqual(expectedCombinedMessages);
		});

		// 원칙: 엣지 케이스 테스트 (빈 입력)
		it('빈 combinedMessages_latest로 호출 시 빈 객체를 반환해야 한다', () => {
			// 준비(Arrange)
			const combinedMessages_latest = {};
			const englishMessageObject_translated = {
				newMessages: { greeting: 'Hello' },
			};
			const expectedCombinedMessages = {}; // 입력이 비었으므로 결과도 비어야 함

			// 실행(Act)
			const result = combineEnglishTranslation(
				combinedMessages_latest,
				englishMessageObject_translated,
			);

			// 검증(Assert)
			expect(result).toEqual(expectedCombinedMessages);
		});
	});

	describe('prepareTranslationPayload', () => {
		beforeEach(() => {
			// 각 테스트 전에 모의 함수 상태 초기화
			vi.mocked(generateKeyNumberFunctions).mockClear();
		});
		// 원칙: 동작 테스트 (정상 케이스)
		it('번역 페이로드와 복원 함수를 올바르게 준비해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1', msg3: 'old msg3' },
				missingMessageKeys: ['msg1', 'msg2'],
			};
			const combinedMessages_latest = {
				msg1: { ko: '메시지1', explanation: '설명1' },
				msg2: { ko: '메시지2' },
				msg3: { ko: '메시지3' }, // 이건 missing 아님
			};
			// generateKeyNumberFunctions가 반환할 것으로 예상되는 값 (외부 헬퍼 사용)
			// vi.mocked() 를 사용하여 모의 함수에 접근하고 구현 설정
			vi.mocked(generateKeyNumberFunctions).mockImplementation(() => ({
				convertToNumberKeys: mockConvertToNumberSimple,
				restoreFromNumberKeys: mockRestoreSimple,
			}));
			const expectedTarget = {
				msg1: { ko: '메시지1', explanation: '설명1' },
				msg2: { ko: '메시지2' },
			};
			const expectedNumberedTarget = mockConvertToNumberSimple(expectedTarget);
			const expectedOlderMessages = ['old msg3']; // missing 아니면서 value에 있는 것

			// 실행(Act)
			const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
				prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

			// 검증(Assert)
			// generateKeyNumberFunctions가 올바른 인수로 호출되었는지 확인
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget);
			expect(restoreFromNumberKeys).toBe(mockRestoreSimple); // 반환된 함수가 모의 함수와 같은지 확인
			expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget);
			expect(olderMessages).toEqual(expectedOlderMessages);
		});

		// 원칙: 엣지 케이스 테스트 (누락된 키 없음)
		it('missingMessageKeys가 비어 있을 때 올바르게 처리해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1' },
				missingMessageKeys: [],
			};
			const combinedMessages_latest = {
				msg1: { ko: '메시지1' },
			};
			// generateKeyNumberFunctions 모의 설정 (외부 헬퍼 사용)
			vi.mocked(generateKeyNumberFunctions).mockImplementation(() => ({
				convertToNumberKeys: mockConvertToNumberSimple,
				restoreFromNumberKeys: mockRestoreSimple,
			}));

			const expectedTarget = {};
			const expectedNumberedTarget = mockConvertToNumberSimple(expectedTarget); // {}
			const expectedOlderMessages = ['old msg1'];

			// 실행(Act)
			const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
				prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

			// 검증(Assert)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget); // {} 인수로 호출
			expect(restoreFromNumberKeys).toBe(mockRestoreSimple);
			expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget); // {}
			expect(olderMessages).toEqual(expectedOlderMessages);
		});
	});

	describe('integrateTranslatedMessages', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		it('번호 매겨진 번역 메시지를 기존 객체에 올바르게 통합해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1', msg3: 'old msg3' },
				missingMessageKeys: ['msg1', 'msg2'],
			};
			const translatedMessages_numbers = {
				1: 'translated msg1', // msg1
				2: 'translated msg2', // msg2
			};
			// restoreFromNumberKeys 모의 함수
			const mockRestoreFromNumberKeys = vi.fn((numberedData) => {
				const restored = {};
				// 실제 로직은 더 복잡하겠지만, 테스트를 위해 간단히 매핑
				if (numberedData[1]) restored.msg1 = numberedData[1];
				if (numberedData[2]) restored.msg2 = numberedData[2];
				return restored;
			});
			const expectedTranslatedMessages = {
				msg1: 'translated msg1',
				msg2: 'translated msg2',
			};
			const expectedNewMessages = {
				msg1: 'translated msg1', // 업데이트됨
				msg2: 'translated msg2', // 새로 추가됨
				msg3: 'old msg3', // 기존 유지
			};
			const expectedResultObject = {
				...languageMessageObject, // 기존 속성 유지
				translatedMessages: expectedTranslatedMessages,
				newMessages: expectedNewMessages,
			};

			// 실행(Act)
			const result = integrateTranslatedMessages(
				languageMessageObject,
				translatedMessages_numbers,
				mockRestoreFromNumberKeys,
			);

			// 검증(Assert)
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(translatedMessages_numbers);
			expect(result).toEqual(expectedResultObject);
			// 원본 객체가 변경되지 않았는지 확인 (불변성)
			expect(languageMessageObject).toEqual({
				value: { msg1: 'old msg1', msg3: 'old msg3' },
				missingMessageKeys: ['msg1', 'msg2'],
			});
		});

		// 원칙: 엣지 케이스 테스트 (빈 번역 결과)
		it('빈 translatedMessages_numbers를 올바르게 처리해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1' },
				missingMessageKeys: ['msg1'],
			};
			const translatedMessages_numbers = {};
			const mockRestoreFromNumberKeys = vi.fn((numberedData) => ({})); // 빈 객체 반환
			const expectedTranslatedMessages = {};
			const expectedNewMessages = { msg1: 'old msg1' }; // 변경 없음
			const expectedResultObject = {
				...languageMessageObject,
				translatedMessages: expectedTranslatedMessages,
				newMessages: expectedNewMessages,
			};

			// 실행(Act)
			const result = integrateTranslatedMessages(
				languageMessageObject,
				translatedMessages_numbers,
				mockRestoreFromNumberKeys,
			);

			// 검증(Assert)
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(translatedMessages_numbers);
			expect(result).toEqual(expectedResultObject);
		});
	});

	describe('translateOneLanguageMessages', () => {
		let mockGetTranslatedMessages;
		let mockRestoreFromNumberKeys;

		beforeEach(() => {
			// 원칙: 외부 시스템/비동기 액션 격리를 위한 모의 사용 (`getTranslatedMessages`)
			vi.mocked(generateKeyNumberFunctions).mockClear(); // 각 테스트 전에 호출 기록 초기화
			mockGetTranslatedMessages = vi.fn();
			// restoreFromNumberKeys 모의 함수 정의 (이 테스트 스코프에서만 필요)
			mockRestoreFromNumberKeys = vi.fn((numberedData) => {
				// 테스트 시나리오에 맞는 간단한 복원 로직
				const restored = {};
				if (numberedData[1]) restored.key1 = numberedData[1];
				if (numberedData[2]) restored.key2 = numberedData[2];
				return restored;
			});
			// generateKeyNumberFunctions 모의 설정 (외부 헬퍼 사용)
			vi.mocked(generateKeyNumberFunctions).mockImplementation(() => ({
				convertToNumberKeys: mockConvertToNumberSimple, // 외부 헬퍼 사용
				restoreFromNumberKeys: mockRestoreFromNumberKeys, // 이 테스트 스코프의 모의 함수 사용
			}));
		});

		afterEach(() => {
			vi.restoreAllMocks(); // 각 테스트 후 모의 복원
		});

		// 원칙: 동작 테스트 (성공 케이스, 비동기)
		// 원칙: 모의 활용 (외부 API 호출 모의)
		it('성공적인 번역 과정을 올바르게 조율하고 결과를 반환해야 한다', async () => {
			// 준비(Arrange)
			const language = 'en';
			const languageMessageObject = {
				value: { key3: 'old val3' },
				missingMessageKeys: ['key1', 'key2'],
			};
			const dictionary = { someWord: 'some definition' }
			const combinedMessages_latest = {
				key1: { ko: '키1 값' },
				key2: { ko: '키2 값', explanation: '설명2' },
				key3: { ko: '키3 값' },
			};
			const expectedNumberedPayload = {
				1: { ko: '키1 값' },
				2: { ko: '키2 값', explanation: '설명2' },
			};
			const expectedOlderMessages = ['old val3'];
			const mockApiResponse = {
				1: 'translated val1',
				2: 'translated val2',
			};
			const expectedRestoredMessages = {
				key1: 'translated val1',
				key2: 'translated val2',
			};
			const expectedNewMessages = {
				key1: 'translated val1', // 추가
				key2: 'translated val2', // 추가
				key3: 'old val3', // 유지
			};
			const expectedFinalResult = {
				...languageMessageObject,
				translatedMessages: expectedRestoredMessages,
				newMessages: expectedNewMessages,
			};

			// getTranslatedMessages 모의 설정 (Promise를 반환하도록)
			mockGetTranslatedMessages.mockResolvedValue(mockApiResponse);

			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledTimes(0);

			// 실행(Act)
			const result = await translateOneLanguageMessages(
				language,
				languageMessageObject,
				dictionary,
				combinedMessages_latest,
				mockGetTranslatedMessages, // 모의 함수 주입
			);

			// 검증(Assert)
			// 1. prepareTranslationPayload가 내부적으로 호출되었는지 (generateKeyNumberFunctions 호출 확인)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledTimes(1);
			// 2. getTranslatedMessages가 올바른 인수로 호출되었는지 확인
			expect(mockGetTranslatedMessages).toHaveBeenCalledWith(
				language,
				expectedNumberedPayload,
				expectedOlderMessages,
				dictionary
			);
			// 3. integrateTranslatedMessages가 내부적으로 호출되었는지 (restoreFromNumberKeys 호출 확인)
			//    integrateTranslatedMessages에 전달된 restore 함수가 호출되었는지 확인
			//    (prepareTranslationPayload가 반환한 restore 함수가 mockRestoreFromNumberKeys 와 같아야 함)
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(mockApiResponse);
			// 4. 최종 결과가 예상과 같은지 확인
			expect(result).toEqual(expectedFinalResult);
		});

		// 원칙: 에러 핸들링 테스트 (비동기)
		it('getTranslatedMessages가 실패할 경우 예외를 전파해야 한다', async () => {
			// 준비(Arrange)
			const language = 'en';
			const languageMessageObject = {
				value: {},
				missingMessageKeys: ['key1'],
			};
			const dictionary = {}
			const combinedMessages_latest = {
				key1: { ko: '키1 값' },
			};
			const expectedError = new Error('Translation API failed');

			// getTranslatedMessages 모의 설정 (Promise를 reject하도록)
			mockGetTranslatedMessages.mockRejectedValue(expectedError);

			// 실행(Act) & 검증(Assert)
			// 원칙: 특정 에러 발생 검증
			await expect(
				translateOneLanguageMessages(
					language,
					languageMessageObject,
					dictionary,
					combinedMessages_latest,
					mockGetTranslatedMessages,
				),
			).rejects.toThrow(expectedError);

			// getTranslatedMessages가 호출되었는지 확인
			expect(mockGetTranslatedMessages).toHaveBeenCalled();
			// 실패 시 restoreFromNumberKeys는 호출되지 않아야 함
			expect(mockRestoreFromNumberKeys).not.toHaveBeenCalled();
		});
	});
});