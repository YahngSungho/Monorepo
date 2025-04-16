import { fc, test } from '@fast-check/vitest';
import { generateKeyNumberFunctions } from '@library/helpers/helper-functions'; // prepareTranslationPayload에서 사용
import { R } from '@library/helpers/R'; // 테스트 대상 코드에서 사용하므로 import
import { beforeEach,describe, expect, it, vi } from 'vitest';

import {
	calculateInitialTranslationState,
	combineEnglishTranslation,
	getTranslatedLanguageMap,
	integrateTranslatedMessages,
	prepareTranslationPayload,
	translateOneLanguageMessages,
} from './translation'; // 테스트 대상 함수 임포트

// Helper function to create mock messageMap structure for PBT
const messageMapArb = fc.dictionary(fc.stringMatching(/^[a-z]{2}$/), // language code (e.g., 'en', 'ko')
	fc.dictionary(fc.string({ minLength: 1 }), fc.string())); // message key -> message string

// Helper function to create mock explanations structure for PBT
const explanationsArb = fc.dictionary(fc.string({ minLength: 1 }), fc.string());

// Helper function to create mock combinedMessages structure for PBT
const combinedMessagesArb = fc.dictionary(fc.string({ minLength: 1 }), // message key
	fc.record({
		ko: fc.string(),
		en: fc.option(fc.string()),
		explanation: fc.option(fc.string()),
	}));


describe('calculateInitialTranslationState 함수 (순수 함수)', () => {
	// 원칙: 동작 테스트 (정상 경로)
	it('한국어 메시지와 설명을 기반으로 combinedMessages_latest를 올바르게 생성해야 한다', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '안녕', key2: '세계' }, en: { key1: 'Hello' } };
		const explanations = { key1: 'Greeting', key2: 'Noun' };
		const combinedMessages_cached = {}; // 캐시 없음
		const expectedCombined = {
			key1: { ko: '안녕', explanation: 'Greeting' },
			key2: { ko: '세계', explanation: 'Noun' },
		};

		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		const { combinedMessages_latest } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert)
		expect(combinedMessages_latest).toEqual(expectedCombined);
	});

	// 원칙: 동작 테스트 (정상 경로)
	it('ko를 제외한 언어에 대해 초기 targetLanguageMap을 생성해야 한다', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '안녕' }, en: { key1: 'Hello' }, fr: { key1: 'Bonjour' } };
		const explanations = {};
		const combinedMessages_cached = {};
		const expectedTargetMap = {
			en: { value: { key1: 'Hello' }, missingMessageKeys: [] }, // 초기엔 missing 비어있음
			fr: { value: { key1: 'Bonjour' }, missingMessageKeys: [] },
		};

		// 실행 (Act)
		const { targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert) - missingMessageKeys는 다음 단계에서 채워짐
		expect(targetLanguageMap.en.value).toEqual(expectedTargetMap.en.value);
		expect(targetLanguageMap.fr.value).toEqual(expectedTargetMap.fr.value);
		expect(targetLanguageMap.ko).toBeUndefined(); // 한국어는 제외되어야 함
	});

	// 원칙: 동작 테스트 (누락 키 식별 - 변경된 메시지)
	it('캐시된 메시지와 비교하여 변경된 메시지 키를 missingMessageKeys에 추가해야 한다', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '새로운 안녕', key2: '세계' }, en: { key1: 'New Hello' } };
		const explanations = { key1: 'Greeting' };
		const combinedMessages_cached = { key1: { ko: '안녕', explanation: 'Greeting' } }; // key1 변경됨

		// 실행 (Act)
		const { targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert)
		expect(targetLanguageMap.en.missingMessageKeys).toEqual(expect.arrayContaining(['key1']));
		// key2는 ko에 있지만 en에는 없으므로 역시 missing에 포함되어야 함
		expect(targetLanguageMap.en.missingMessageKeys).toEqual(expect.arrayContaining(['key2']));
		// 중복 없이 유니크해야 함
		expect(targetLanguageMap.en.missingMessageKeys.length).toBe(R.uniq(targetLanguageMap.en.missingMessageKeys).length);
	});

	// 원칙: 동작 테스트 (누락 키 식별 - 새 메시지)
	it('대상 언어에 존재하지 않는 메시지 키를 missingMessageKeys에 추가해야 한다', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '안녕', key2: '추가됨' }, en: { key1: 'Hello' } }; // en에는 key2 없음
		const explanations = { key1: 'Greeting', key2: 'Added' };
		const combinedMessages_cached = { key1: { ko: '안녕', explanation: 'Greeting' } };

		// 실행 (Act)
		const { targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert)
		expect(targetLanguageMap.en.missingMessageKeys).toEqual(expect.arrayContaining(['key2']));
		// key1은 변경되지 않았고 en에 존재하므로 포함되지 않아야 함 (위 테스트와 별개 시나리오)
		expect(targetLanguageMap.en.missingMessageKeys).not.toEqual(expect.arrayContaining(['key1']));
	});

	// 원칙: 동작 테스트 (누락 키 식별 - 설명 변경)
	it('설명만 변경된 경우에도 해당 키를 missingMessageKeys에 추가해야 한다', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '안녕' }, en: { key1: 'Hello' } };
		const explanations = { key1: 'Updated Greeting' }; // 설명 변경
		const combinedMessages_cached = { key1: { ko: '안녕', explanation: 'Greeting' } };

		// 실행 (Act)
		const { targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert)
		expect(targetLanguageMap.en.missingMessageKeys).toEqual(expect.arrayContaining(['key1']));
	});

	// 원칙: 동작 테스트 (엣지 케이스 - 변경 없음)
	it('캐시된 내용과 비교하여 변경 사항이 없으면 missingMessageKeys가 비어 있어야 한다 (대상 언어에 키가 존재할 때)', () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '안녕' }, en: { key1: 'Hello' } };
		const explanations = { key1: 'Greeting' };
		const combinedMessages_cached = { key1: { ko: '안녕', explanation: 'Greeting' } }; // 변경 없음

		// 실행 (Act)
		const { targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert)
		expect(targetLanguageMap.en.missingMessageKeys).toEqual([]); // 변경 없으므로 비어 있어야 함
	});

	// 원칙: 속성 기반 테스트 (PBT) - 주요 동작 속성 검증
	// 설명: 생성된 입력에 대해 combinedMessages_latest와 targetLanguageMap 구조, 누락 키 식별 로직의 핵심 속성을 검증합니다.
	test.prop([messageMapArb, explanationsArb, combinedMessagesArb])
	('다양한 입력에 대해 구조 및 누락 키 식별 규칙을 만족해야 한다', (messageMap, explanations, combinedMessages_cached) => {
		// 준비 (Arrange): fast-check가 입력 생성
		const koMessages = messageMap.ko || {};

		// 실행 (Act)
		const { combinedMessages_latest, targetLanguageMap } = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);

		// 검증 (Assert): 주요 동작 속성 검증
		// 1. combinedMessages_latest 키는 ko 키와 일치해야 함
		expect(Object.keys(combinedMessages_latest).sort((a, b) => a.localeCompare(b))).toEqual(Object.keys(koMessages).sort((a, b) => a.localeCompare(b)));

		// 2. combinedMessages_latest 값은 ko 메시지와 설명을 포함해야 함
		for (const key in koMessages) {
			expect(combinedMessages_latest[key].ko).toBe(koMessages[key]);
			if (explanations[key]) {
				expect(combinedMessages_latest[key].explanation).toBe(explanations[key]);
			} else {
				expect(combinedMessages_latest[key].explanation).toBeUndefined();
			}
		}

		// 3. targetLanguageMap 키는 messageMap 키에서 'ko'를 제외한 것과 일치해야 함
		const expectedTargetLangs = Object.keys(messageMap).filter(lang => lang !== 'ko').sort((a, b) => a.localeCompare(b));
		expect(Object.keys(targetLanguageMap).sort((a, b) => a.localeCompare(b))).toEqual(expectedTargetLangs);

		// 4. 누락 키 규칙 검증
		for (const [lang, langData] of Object.entries(targetLanguageMap)) {
			const originalLangMessages = messageMap[lang] || {};
			expect(langData.value).toEqual(originalLangMessages); // value는 원본과 같아야 함
			expect(Array.isArray(langData.missingMessageKeys)).toBe(true); // 배열이어야 함
			expect(langData.missingMessageKeys.length).toBe(R.uniq(langData.missingMessageKeys).length); // 유니크해야 함

			for (const [msgKey, combinedMsg] of Object.entries(combinedMessages_latest)) {
				const cachedMsg = combinedMessages_cached[msgKey];
				const isChanged = JSON.stringify(combinedMsg) !== JSON.stringify(cachedMsg);
				const existsInTarget = Object.hasOwn(langData.value, msgKey);

				// 변경되었거나 대상 언어에 원래 없었다면 missingKeys에 포함되어야 함
				if (isChanged || !existsInTarget) {
					expect(langData.missingMessageKeys).toContain(msgKey);
				} else {
					// 변경되지 않았고 대상 언어에 존재한다면 missingKeys에 없어야 함
					expect(langData.missingMessageKeys).not.toContain(msgKey);
				}
			}
		}
	});
});

describe('combineEnglishTranslation 함수 (순수 함수)', () => {
	// 원칙: 동작 테스트 (정상 경로)
	it('번역된 영어 메시지를 combinedMessages_latest에 올바르게 병합해야 한다', () => {
		// 준비 (Arrange)
		const combinedMessages_latest = {
			key1: { ko: '안녕', explanation: 'Greeting' },
			key2: { ko: '세계', explanation: 'Noun' },
		};
		const englishMessageObject_translated = {
			// ... other properties ignored by this function
			newMessages: { // 이 객체의 값이 'en'으로 병합되어야 함
				key1: 'Hello',
				key2: 'World',
			},
		};
		const expectedCombined = {
			key1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
			key2: { en: 'World', ko: '세계', explanation: 'Noun' },
		};

		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		const result = combineEnglishTranslation(combinedMessages_latest, englishMessageObject_translated);

		// 검증 (Assert)
		expect(result).toEqual(expectedCombined);
	});

	// 원칙: 동작 테스트 (엣지 케이스 - 일부 키 누락)
	it('영어 번역 결과에 일부 키가 누락된 경우에도 기존 정보는 유지해야 한다', () => {
		// 준비 (Arrange)
		const combinedMessages_latest = {
			key1: { ko: '안녕' },
			key2: { ko: '세계' },
		};
		const englishMessageObject_translated = {
			newMessages: {
				key1: 'Hello', // key2는 번역 결과에 없음
			},
		};
		const expectedCombined = {
			key1: { en: 'Hello', ko: '안녕' },
			key2: { en: undefined, ko: '세계' }, // key2는 en 값이 undefined가 됨 (구현 방식에 따름)
		};

		// 실행 (Act)
		const result = combineEnglishTranslation(combinedMessages_latest, englishMessageObject_translated);

		// 검증 (Assert)
		expect(result).toEqual(expectedCombined);
	});

	// 원칙: 동작 테스트 (엣지 케이스 - 빈 입력)
	it('입력 객체가 비어있는 경우를 처리해야 한다', () => {
		// 준비 (Arrange)
		const combinedMessages_latest = {};
		const englishMessageObject_translated = { newMessages: {} };
		const expectedCombined = {};

		// 실행 (Act)
		const result = combineEnglishTranslation(combinedMessages_latest, englishMessageObject_translated);

		// 검증 (Assert)
		expect(result).toEqual(expectedCombined);
	});
});

describe('prepareTranslationPayload 함수 (순수 함수)', () => {
	let mockGenerateKeyNumberFunctions;
	let mockConvertToNumberKeys;
	let mockRestoreFromNumberKeys;

	beforeEach(() => {
		// 원칙: 의존성 모의 - 외부 헬퍼 함수 모의
		// generateKeyNumberFunctions가 반환하는 함수들을 제어하기 위해 모의 처리
		mockConvertToNumberKeys = vi.fn(obj => {
			// 단순 모의 구현: key -> __num_key__
			const numbered = {};
			for (const [index, key] of Object.keys(obj).entries()) numbered[`__num_${index}__`] = obj[key];
			return numbered;
		});
		mockRestoreFromNumberKeys = vi.fn(obj => {
			// 단순 모의 구현: __num_key__ -> key
			const restored = {};
			for (const [index, numKey] of Object.keys(obj).entries()) restored[`key${index}`] = obj[numKey];
			return restored;
		});
		mockGenerateKeyNumberFunctions = vi.fn(() => ({
			convertToNumberKeys: mockConvertToNumberKeys,
			restoreFromNumberKeys: mockRestoreFromNumberKeys,
		}));

		// 실제 모듈 대신 모의 함수 사용하도록 설정 (필요 시)
		// vi.mock('@library/helpers/helper-functions', () => ({
		//   generateKeyNumberFunctions: mockGenerateKeyNumberFunctions
		// }));
		// 참고: 위 vi.mock 방식 대신, 실제 함수를 사용하고 결과를 검증하는 방식도 가능
	});

	// 원칙: 동작 테스트 (정상 경로)
	it('missingMessageKeys에 있는 메시지만 추출하고 번호 키로 변환해야 한다', () => {
		// 준비 (Arrange)
		const languageMessageObject = {
			value: { key0: 'Old message 0', key1: 'Old message 1' },
			missingMessageKeys: ['key1', 'key2'], // key1, key2 번역 필요
		};
		const combinedMessages_latest = {
			key0: { ko: '제로' },
			key1: { ko: '하나', explanation: 'Number 1' },
			key2: { ko: '둘', explanation: 'Number 2' },
		};
		const expectedTarget = { // missingMessageKeys에 해당하는 메시지만 포함
			key1: combinedMessages_latest.key1,
			key2: combinedMessages_latest.key2,
		};
		// 실제 generateKeyNumberFunctions 사용 테스트 (모의 대신)
		const realKeyFunctions = generateKeyNumberFunctions(expectedTarget);


		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		// const { combinedMessages_target_numbers, restoreFromNumberKeys: actualRestoreFn } = prepareTranslationPayload(languageMessageObject, combinedMessages_latest);
		// 실제 함수 사용
		const { combinedMessages_target_numbers, restoreFromNumberKeys: actualRestoreFn, olderMessages } = prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

		// 검증 (Assert)
		// 1. generateKeyNumberFunctions가 올바른 인자(타겟 메시지)로 호출되었는지 확인 (실제 함수 사용 시 이 검증은 불필요)
		// expect(mockGenerateKeyNumberFunctions).toHaveBeenCalledWith(expectedTarget);

		// 2. 반환된 번호 매핑된 객체가 예상과 일치하는지 확인
		// expect(mockConvertToNumberKeys).toHaveBeenCalledWith(expectedTarget); // 모의 사용 시
		// expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget); // 모의 사용 시
		expect(combinedMessages_target_numbers).toEqual(realKeyFunctions.convertToNumberKeys(expectedTarget)); // 실제 함수 결과 비교

		// 3. restore 함수가 반환되었는지 확인
		expect(actualRestoreFn).toBeTypeOf('function');

		// 4. olderMessages가 올바르게 추출되었는지 확인 (missing이 아닌 메시지)
		expect(olderMessages).toEqual([languageMessageObject.value.key0]);
	});

	// 원칙: 동작 테스트 (엣지 케이스 - missingMessageKeys 비어있음)
	it('missingMessageKeys가 비어 있으면 빈 객체와 빈 olderMessages를 반환해야 한다', () => {
		// 준비 (Arrange)
		const languageMessageObject = {
			value: { key0: 'Old message 0' },
			missingMessageKeys: [], // 누락 키 없음
		};
		const combinedMessages_latest = { key0: { ko: '제로' } };
		const expectedNumberedTarget = {};

		// 실행 (Act)
		const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } = prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

		// 검증 (Assert)
		expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget);
		expect(restoreFromNumberKeys).toBeTypeOf('function'); // 함수 자체는 반환되어야 함
		expect(olderMessages).toEqual([languageMessageObject.value.key0]); // 모든 메시지가 older
	});
});

describe('integrateTranslatedMessages 함수 (순수 함수)', () => {
	// 원칙: 명확성을 위한 인라인 설정
	const mockRestoreFromNumberKeys = vi.fn(numbered => {
		// 간단한 모의 복원 로직: __num_X__ -> keyX
		const restored = {};
		for (const numKey of Object.keys(numbered)) {
			const match = /__num_(\d+)__/.exec(numKey);
			if (match) {
				restored[`key${match[1]}`] = numbered[numKey];
			}
		}
		return restored;
	});

	// 원칙: 동작 테스트 (정상 경로)
	it('번호 키로 된 번역 결과를 원래 키로 복원하고 기존 메시지와 병합해야 한다 (불변성 유지)', () => {
		// 준비 (Arrange)
		const languageMessageObject = {
			value: { key0: 'Original 0', key1: 'Original 1' }, // 기존 메시지
			missingMessageKeys: ['key0', 'key1'],
			// other properties...
		};
		const translatedMessages_numbers = {
			__num_0__: 'Translated 0', // key0에 해당
			__num_1__: 'Translated 1', // key1에 해당
		};
		const expectedRestoredMessages = { // 모의 복원 함수 결과 예상
			key0: 'Translated 0',
			key1: 'Translated 1',
		};
		const expectedNewMessages = { // 복원된 메시지가 value에 병합된 결과
			key0: 'Translated 0',
			key1: 'Translated 1',
		};
		const originalValue = languageMessageObject.value; // 불변성 확인용

		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		const result = integrateTranslatedMessages(languageMessageObject, translatedMessages_numbers, mockRestoreFromNumberKeys);

		// 검증 (Assert)
		// 1. restoreFromNumberKeys가 올바른 인자로 호출되었는지 확인
		expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(translatedMessages_numbers);

		// 2. 반환된 객체가 translatedMessages (복원됨) 와 newMessages (병합됨)를 포함하는지 확인
		expect(result.translatedMessages).toEqual(expectedRestoredMessages);
		expect(result.newMessages).toEqual(expectedNewMessages);

		// 3. 원본 languageMessageObject.value가 변경되지 않았는지 확인 (불변성)
		expect(languageMessageObject.value).toBe(originalValue); // 참조 동일성 확인 (mutative가 새 객체 반환)
		expect(languageMessageObject.value).not.toBe(result.newMessages); // 새 객체여야 함
		expect(languageMessageObject.value).toEqual({ key0: 'Original 0', key1: 'Original 1' }); // 값 불변 확인

		// 4. 반환된 객체가 원본 languageMessageObject의 다른 속성들을 유지하는지 확인
		expect(result.value).toBe(languageMessageObject.value); // value 자체는 변경되지 않음
		expect(result.missingMessageKeys).toBe(languageMessageObject.missingMessageKeys);
	});

	// 원칙: 동작 테스트 (엣지 케이스 - 빈 번역 결과)
	it('번역 결과가 비어있으면 translatedMessages와 newMessages가 비어있거나 기존 상태를 유지해야 한다', () => {
		// 준비 (Arrange)
		const languageMessageObject = {
			value: { key0: 'Original 0' },
			missingMessageKeys: [],
		};
		const translatedMessages_numbers = {}; // 빈 번역 결과
		const expectedRestoredMessages = {};
		const expectedNewMessages = { key0: 'Original 0' }; // 변경 없음

		// 실행 (Act)
		const result = integrateTranslatedMessages(languageMessageObject, translatedMessages_numbers, mockRestoreFromNumberKeys);

		// 검증 (Assert)
		expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(translatedMessages_numbers);
		expect(result.translatedMessages).toEqual(expectedRestoredMessages);
		expect(result.newMessages).toEqual(expectedNewMessages); // 기존 value와 동일
		expect(result.newMessages).toBe(languageMessageObject.value); // create에서 변경 없으면 원본 반환 가능
	});
});

describe('translateOneLanguageMessages 함수 (비동기 액션 래퍼)', () => {
	let mockGetTranslatedMessages;
	let mockPrepareTranslationPayload;
	let mockIntegrateTranslatedMessages;
	let mockRestoreFn;

	beforeEach(() => {
		// 원칙: 의존성 모의 (핵심 액션 및 순수 함수)
		mockGetTranslatedMessages = vi.fn(); // 외부 번역 API 호출 모의
		mockRestoreFn = vi.fn();
		mockPrepareTranslationPayload = vi.fn(() => ({ // prepareTranslationPayload 모의
			combinedMessages_target_numbers: { __num_0__: { ko: '안녕' } },
			restoreFromNumberKeys: mockRestoreFn,
			olderMessages: ['Old msg'],
		}));
		mockIntegrateTranslatedMessages = vi.fn(() => ({ // integrateTranslatedMessages 모의
			value: { key0: 'Translated Hello' },
			translatedMessages: { key0: 'Translated Hello' },
			newMessages: { key0: 'Translated Hello' },
			missingMessageKeys: [], // 예시
		}));

		// 실제 함수 대신 모의 함수 사용하도록 설정 (선택적)
		// 이 접근 방식은 translateOneLanguageMessages 내부 로직만 테스트하고 싶을 때 유용
		// vi.mock('./translation', async (importOriginal) => {
		//   const original = await importOriginal();
		//   return {
		//     ...original, // 다른 함수는 실제 구현 사용
		//     prepareTranslationPayload: mockPrepareTranslationPayload,
		//     integrateTranslatedMessages: mockIntegrateTranslatedMessages,
		//   };
		// });
		// 여기서는 내부 함수 호출을 직접 검증하기 위해 모의하지 않고, getTranslatedMessages만 모의
	});

	// 원칙: 동작 테스트 (정상 흐름 - async/await 사용)
	it('올바른 순서로 prepare, getTranslatedMessages(액션), integrate를 호출하고 결과를 반환해야 한다', async () => {
		// 준비 (Arrange)
		const language = 'en';
		const languageMessageObject = { value: {}, missingMessageKeys: ['key0'] };
		const dictionary = { some_word: 'some translation' };
		const combinedMessages_latest = { key0: { ko: '안녕' } };
		const mockTranslatedNumbers = { __num_0__: 'Hello' };

		// mockGetTranslatedMessages 설정
		mockGetTranslatedMessages.mockResolvedValue(mockTranslatedNumbers);

		// prepareTranslationPayload와 integrateTranslatedMessages는 실제 함수 사용, 결과 검증
		const realPayload = prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		const result = await translateOneLanguageMessages(language, languageMessageObject, dictionary, combinedMessages_latest, mockGetTranslatedMessages);

		// 검증 (Assert)
		// 1. prepareTranslationPayload가 호출되었는지 (내부 호출 검증 대신 결과 검증)
		// expect(mockPrepareTranslationPayload).toHaveBeenCalledWith(languageMessageObject, combinedMessages_latest);

		// 2. getTranslatedMessages가 올바른 인자로 호출되었는지 (모의 함수 검증)
		expect(mockGetTranslatedMessages).toHaveBeenCalledWith(
			language,
			realPayload.combinedMessages_target_numbers, // prepare 결과 사용
			realPayload.olderMessages, // prepare 결과 사용
			dictionary
		);

		// 3. integrateTranslatedMessages가 호출되었는지 (내부 호출 검증 대신 결과 검증)
		// expect(mockIntegrateTranslatedMessages).toHaveBeenCalledWith(
		//   languageMessageObject,
		//   mockTranslatedNumbers, // getTranslatedMessages 결과 사용
		//   realPayload.restoreFromNumberKeys // prepare 결과 사용
		// );

		// 4. 최종 결과가 integrateTranslatedMessages의 결과와 일치하는지 (실제 integrate 함수 결과 검증)
		const expectedResult = integrateTranslatedMessages(languageMessageObject, mockTranslatedNumbers, realPayload.restoreFromNumberKeys);
		expect(result).toEqual(expectedResult);
	});

	// 원칙: 동작 테스트 (오류 처리 - async/await, rejects 사용)
	it('getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비 (Arrange)
		const language = 'en';
		const languageMessageObject = { value: {}, missingMessageKeys: ['key0'] };
		const dictionary = {};
		const combinedMessages_latest = { key0: { ko: '안녕' } };
		const translationError = new Error('Translation API failed');

		// mockGetTranslatedMessages 설정 (실패 케이스)
		mockGetTranslatedMessages.mockRejectedValue(translationError);

		// 실행 (Act) & 검증 (Assert) - 원칙: 오류 발생 동작 테스트
		await expect(translateOneLanguageMessages(language, languageMessageObject, dictionary, combinedMessages_latest, mockGetTranslatedMessages))
			.rejects.toThrow(translationError); // 동일한 오류가 전파되는지 확인
	});
});


describe('getTranslatedLanguageMap 함수 (비동기 오케스트레이터)', () => {
	let mockGetTranslatedMessages;

	beforeEach(() => {
		// 원칙: 의존성 모의 (테스트 대상 함수의 핵심 의존성)
		mockGetTranslatedMessages = vi.fn(); // 최종 액션 모의
		// 아래 함수들을 모의 처리하면 getTranslatedLanguageMap의 '조정' 로직만 테스트 가능
		// 모의하지 않으면 통합 테스트에 가까워짐 (여기서는 통합 테스트 방식으로 진행)
		// mockCalculateInitialTranslationState = vi.fn();
		// mockCombineEnglishTranslation = vi.fn();
		// mockTranslateOneLanguageMessages = vi.fn();

		// vi.mock('./translation', async (importOriginal) => {
		//   const original = await importOriginal();
		//   return {
		//     ...original,
		//     calculateInitialTranslationState: mockCalculateInitialTranslationState,
		//     combineEnglishTranslation: mockCombineEnglishTranslation,
		//     translateOneLanguageMessages: mockTranslateOneLanguageMessages,
		//     // getTranslatedMessages는 인자로 받으므로 모의 불필요
		//   };
		// });
	});

	// 원칙: 동작 테스트 (정상 흐름 - 영어 포함)
	it('영어와 다른 언어를 올바른 순서와 인자로 번역하고 결과를 맵으로 반환해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			ko: { key1: '하나', key2: '둘' },
			en: { key1: 'One' },
			fr: { key1: 'Un' },
		};
		const explanations = { key1: 'Number 1', key2: 'Number 2' };
		const dictPerLanguage = { en: { one: 'one' }, fr: { un: 'un' } };
		const combinedMessages_cached = { key1: { ko: '하나', explanation: 'Number 1' } }; // key1 영어 변경, key2 새로 추가됨

		// 예상되는 중간 상태 및 결과
		const initialState = calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached);
		// initialState.targetLanguageMap.en.missingMessageKeys = ['key1', 'key2']
		// initialState.targetLanguageMap.fr.missingMessageKeys = ['key2']
		const enTranslatedPayload = { '0': 'Two' }; // key1, key2 번역 가정
		const { restoreFromNumberKeys } = generateKeyNumberFunctions({ key2: initialState.combinedMessages_latest.key2 })
		const enResult = integrateTranslatedMessages(initialState.targetLanguageMap.en, enTranslatedPayload, restoreFromNumberKeys);
		const combinedWithEn = combineEnglishTranslation(initialState.combinedMessages_latest, enResult);

		const frTranslatedPayload = { '0': 'Deux' };
		const frResult = integrateTranslatedMessages(initialState.targetLanguageMap.fr, frTranslatedPayload, generateKeyNumberFunctions({ key2: combinedWithEn.key2 }).restoreFromNumberKeys);
		// getTranslatedMessages 모의 설정
		mockGetTranslatedMessages
			.mockResolvedValueOnce(enTranslatedPayload) // 영어 번역 결과
			.mockResolvedValueOnce(frTranslatedPayload); // 프랑스어 번역 결과

		// 실행 (Act) - 원칙: 공개 API 동작 테스트
		const result = await getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages);
		// 검증 (Assert)
		// 1. 영어 번역 호출 확인 (첫 번째 호출)
		const enPayload = prepareTranslationPayload(initialState.targetLanguageMap.en, initialState.combinedMessages_latest);
		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(1,
			'en',
			enPayload.combinedMessages_target_numbers,
			enPayload.olderMessages,
			dictPerLanguage.en
		);

		// 2. 프랑스어 번역 호출 확인 (두 번째 호출, 영어 번역 후 combined 메시지 사용)
		const frPayload = prepareTranslationPayload(initialState.targetLanguageMap.fr, combinedWithEn);
		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(2,
			'fr',
			frPayload.combinedMessages_target_numbers,
			frPayload.olderMessages,
			dictPerLanguage.fr
		);

		// 3. 최종 결과 맵 확인
		expect(result.en).toEqual(enResult);
		expect(result.fr).toEqual(frResult);
		expect(Object.keys(result)).toEqual(['en', 'fr']); // ko는 포함되지 않음
	});

	// 원칙: 동작 테스트 (오류 처리 - 'en' 누락)
	it("messageMap에 'en' 키가 없으면 오류를 발생시켜야 한다", async () => {
		// 준비 (Arrange)
		const messageMap = { ko: { key1: '하나' }, fr: { key1: 'Un' } }; // 'en' 없음
		const explanations = {};
		const dictPerLanguage = {};
		const combinedMessages_cached = {};

		// 실행 (Act) & 검증 (Assert) - 원칙: 오류 발생 동작 테스트
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow("English ('en') messages not found in messageMap.");
	});

	// 원칙: 동작 테스트 (오류 처리 - 영어 번역 실패)
	it('영어 번역 중 getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = { ko: {}, en: {} };
		const explanations = {};
		const dictPerLanguage = { en: {} };
		const combinedMessages_cached = {};
		const translationError = new Error('English translation failed');
		mockGetTranslatedMessages.mockRejectedValueOnce(translationError); // 영어 번역 실패 설정

		// 실행 (Act) & 검증 (Assert)
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(translationError);
	});

	// 원칙: 동작 테스트 (오류 처리 - 다른 언어 번역 실패)
	it('다른 언어 번역 중 getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = { ko: {}, en: {}, fr: {} };
		const explanations = {};
		const dictPerLanguage = { en: {}, fr: {} };
		const combinedMessages_cached = {};
		const translationError = new Error('French translation failed');
		mockGetTranslatedMessages
			.mockResolvedValueOnce({ __num_0__: 'Hello' }) // 영어는 성공
			.mockRejectedValueOnce(translationError); // 프랑스어 실패

		// 실행 (Act) & 검증 (Assert)
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(translationError);
	});
});
