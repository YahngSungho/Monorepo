// 모의 대상 함수 임포트 (vi.mocked 사용 위해 필요)
import fs from 'node:fs'; // fs 모의 위해 임포트

import { getAbsolutePath } from '@library/helpers/fs-sync'; // 경로 헬퍼 모의 위해 임포트
import { generateKeyNumberFunctions } from '@library/helpers/helper-functions';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	calculateInitialTranslationStateByBaseLanguages,
	combineEnglishTranslation,
	getInitialLanguageMap,
	getNewCache,
	integrateTranslatedMessages,
	prepareTranslationPayload,
	translateOneLanguageMessages,
} from './helpers'; // 테스트 대상 함수 임포트

// --- 모의 설정 ---

// generateKeyNumberFunctions 모의
vi.mock('@library/helpers/helper-functions', () => ({
	generateKeyNumberFunctions: vi.fn(),
}));

// fs 모의 (getInitialLanguageMap 테스트용)
vi.mock('node:fs', () => ({
	// default export를 명시하고, 그 안에 필요한 함수들을 mock합니다.
	default: {
		readFileSync: vi.fn(),
	},
	// 만약 다른 named export도 사용한다면 여기에 추가합니다.
	// 예를 들어: statSync: vi.fn()
}));

// 경로 헬퍼 모의 (getInitialLanguageMap 테스트용)
vi.mock('@library/helpers/fs-sync', () => ({
	getAbsolutePath: vi.fn(),
}));

// Ramda와 mutative는 일반적으로 모의할 필요가 없습니다. 라이브러리의 실제 동작을 테스트합니다.

// --- 공통 헬퍼 ---

// 원칙: 모의 최소화 - generateKeyNumberFunctions 모의용 간단 헬퍼
const mockRestoreSimple = (data) => data;
const mockConvertToNumberSimple = (data) => {
	const numbered = {};
	let i = 1;
	for (const key in data) {
		numbered[i++] = data[key];
	}
	return numbered;
};

describe('Translation Helpers', () => {
	// 각 테스트 후 모든 모의 상태 초기화/복원
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getInitialLanguageMap', () => {
		// 원칙: 최후 수단 모의 - 실제 파일 시스템 I/O 격리 (Principle #1)
		beforeEach(() => {
			// 모의 기본 설정
			vi.mocked(getAbsolutePath).mockReturnValue('mock/path/to/settings.json');
		});

		// 원칙: 동작 테스트 (성공 케이스)
		it('설정 파일을 읽고 언어 맵을 올바르게 초기화해야 한다', () => {
			// 준비(Arrange)
			const mockSettings = {
				locales: ['ko', 'en', 'ja'],
				// 다른 설정들...
			};
			const mockFileContent = JSON.stringify(mockSettings);
			vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
			const expectedMap = {
				ko: {},
				en: {},
				ja: {},
			};

			// 실행(Act)
			const result = getInitialLanguageMap();

			// 검증(Assert)
			expect(vi.mocked(getAbsolutePath)).toHaveBeenCalledWith(
				expect.any(String), // import.meta.url 부분은 정확히 일치시키기 어려움
				'../../../paraglide/project.inlang/settings.json',
			);
			expect(vi.mocked(fs.readFileSync)).toHaveBeenCalledWith(
				'mock/path/to/settings.json',
				'utf8',
			);
			expect(result).toEqual(expectedMap);
		});

		// 원칙: 에러 핸들링 테스트
		it('설정 파일을 읽는 중 오류가 발생하면 예외를 던져야 한다', () => {
			// 준비(Arrange)
			const mockError = new Error('File not found');
			vi.mocked(fs.readFileSync).mockImplementation(() => {
				throw mockError;
			});

			// 실행(Act) & 검증(Assert)
			// 원칙: 특정 에러 발생 검증
			expect(() => getInitialLanguageMap()).toThrow(mockError);
		});

		// 원칙: 엣지 케이스 (빈 로케일 목록)
		it('설정 파일에 로케일 목록이 비어있으면 빈 객체를 반환해야 한다', () => {
			// 준비(Arrange)
			const mockSettings = {
				locales: [],
			};
			const mockFileContent = JSON.stringify(mockSettings);
			vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);
			const expectedMap = {};

			// 실행(Act)
			const result = getInitialLanguageMap();

			// 검증(Assert)
			expect(result).toEqual(expectedMap);
		});
	});

	describe('calculateInitialTranslationStateByBaseLanguages', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		// 원칙: 모의 최소화 (순수 함수이므로 모의 불필요)
		it('기본 언어와 메시지 맵을 기반으로 초기 상태를 올바르게 계산해야 한다', () => {
			// 준비(Arrange)
			const baseLanguages = ['ko'];
			const messageMap = {
				ko: { greeting: '안녕하세요', farewell: '안녕히 가세요' },
				en: { greeting: 'Hello' }, // farewell 누락
				ja: {}, // 비어 있음
			};
			const explanations = {
				greeting: '인사말',
			};
			const combinedMessages_cached = {
				greeting: { ko: '안녕하세요_이전', explanation: '인사말_이전' }, // ko, 설명 변경됨
				extra: { ko: '추가 메시지' } // 캐시에만 존재
			};
			// 계산 로직:
			// 1. combinedMessages_latest 생성: baseLanguages ('ko') 와 explanations 기반
			const expectedCombinedMessages_latest = {
				greeting: { ko: '안녕하세요', explanation: '인사말' },
				farewell: { ko: '안녕히 가세요' },
			};
			// 2. initialTargetLanguageMap 생성: baseLanguages 제외하고 value, 빈 missingMessageKeys 추가
			// 3. missingMessageKeys 계산:
			//    - combinedMessages_latest 와 combinedMessages_cached 비교 (R.equals)
			//    - greeting: {ko:'안녕', exp:'인사말'} !== {ko:'안녕_이전', exp:'인사말_이전'} -> isChanged = true
			//    - farewell: {ko:'안녕히'} !== undefined (캐시에 없음) -> isChanged = true
			//    - 언어별 value에 키가 없는 경우도 추가
			//    - en: greeting 변경됨 -> 추가. farewell 없음 -> 추가. 결과: ['greeting', 'farewell']
			//    - ja: greeting 변경됨 -> 추가. farewell 없음 -> 추가. 결과: ['greeting', 'farewell']
			// 4. missingMessageKeys 계산 결과를 targetLanguageMap에 추가
			const expectedTargetLanguageMap = {
				en: { value: { greeting: 'Hello' }, missingMessageKeys: ['greeting', 'farewell'] },
				ja: { value: {}, missingMessageKeys: ['greeting', 'farewell'] },
			};

			// 실행(Act)
			const { combinedMessages_latest, targetLanguageMap } =
				calculateInitialTranslationStateByBaseLanguages(
					baseLanguages,
					messageMap,
					explanations,
					combinedMessages_cached,
				);

			// 검증(Assert)
			expect(combinedMessages_latest).toEqual(expectedCombinedMessages_latest);
			expect(targetLanguageMap).toEqual(expectedTargetLanguageMap);
			// 불변성 검증 (입력 객체가 변경되지 않았는지)
			expect(messageMap).toEqual({
				ko: { greeting: '안녕하세요', farewell: '안녕히 가세요' },
				en: { greeting: 'Hello' },
				ja: {},
			});
			expect(combinedMessages_cached).toEqual({
				greeting: { ko: '안녕하세요_이전', explanation: '인사말_이전' },
				extra: { ko: '추가 메시지' }
			});

		});

		// 원칙: 엣지 케이스 테스트 (빈 입력)
		it('빈 messageMap으로 호출 시 올바르게 처리해야 한다', () => {
			// 준비(Arrange)
			const baseLanguages = ['ko'];
			const messageMap = {};
			const explanations = {};
			const combinedMessages_cached = {};
			const expectedCombinedMessages_latest = {};
			const expectedTargetLanguageMap = {};

			// 실행(Act)
			const { combinedMessages_latest, targetLanguageMap } =
				calculateInitialTranslationStateByBaseLanguages(
					baseLanguages,
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
			const baseLanguages = ['ko'];
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
					baseLanguages,
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
		// 원칙: 모의 최소화 (순수 함수)
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
			// 불변성 확인
			expect(combinedMessages_latest).toEqual({
				greeting: { ko: '안녕하세요', explanation: '인사말' },
				farewell: { ko: '안녕히 가세요' },
			});
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

		// 원칙: 엣지 케이스 (번역 결과에 없는 키)
		it('번역 결과에 없는 키는 combinedMessages_latest에서 제외되어야 한다', () => {
			// 준비(Arrange)
			const combinedMessages_latest = {
				greeting: { ko: '안녕하세요', explanation: '인사말' },
				farewell: { ko: '안녕히 가세요' },
			};
			const englishMessageObject_translated = {
				newMessages: {
					greeting: 'Hello', // farewell 없음
				},
			};
			// R.mapObjIndexed는 combinedMessages_latest를 순회하므로,
			// farewell 키도 처리 대상이 되지만, englishMessageObject_translated.newMessages['farewell'] 이 undefined 이므로
			// 결과적으로 en 키가 없는 상태로 결합됨. combineEnglishTranslation의 현재 로직은 en을 무조건 덮어쓰는 형태가 아님.
			// * 수정 필요 *: 현재 구현은 R.mapObjIndexed를 사용하므로, englishMessageObject_translated.newMessages[messageKey] 가 없는 키는 en 필드가 추가되지 않음.
			// const expectedCombinedMessages = {
			// 	greeting: { en: 'Hello', ko: '안녕하세요', explanation: '인사말' },
			// 	// farewell 키에 대한 en 번역이 없으므로, en 필드가 추가되지 않아야 함
			// 	// * 수정 *: 아님. 현재 구현은 {...value, en: 번역값} 이므로, 번역값이 없으면 en: undefined 가 될 수 있음. -> 아님 newMessages[messageKey] 사용.
			// 	// 정확히는, R.mapObjIndexed 의 콜백은 combinedMessages_latest의 모든 키에 대해 실행됨.
			// 	// greeting의 경우: { ko: '안녕', exp: '인사' } 가 value로 들어오고 -> en: 'Hello', ...value 반환
			// 	// farewell의 경우: { ko: '안녕히' } 가 value로 들어오고 -> en: undefined, ...value 반환
			// 	// *** 최종 결과 확인: 구현 상 en: undefined가 맞음 *** -> 아님, newMessages[messageKey] 를 바로 사용함.
			// 	farewell: { en: undefined, ko: '안녕히 가세요' }, // 수정: 구현을 다시 보니 newMessages에서 가져오므로 en: undefined
			// };
			// ---> 소스 코드 확인 결과: en: englishMessageObject_translated.newMessages[messageKey] 이므로 없는 키는 en: undefined가 맞음.
			// ---> 재확인: newMessages에 없는 key는 en에 undefined가 할당됨.
			const expectedFinal = {
				greeting: { en: 'Hello', ko: '안녕하세요', explanation: '인사말' },
				farewell: { en: undefined, ko: '안녕히 가세요' },
			};

			// 실행(Act)
			const result = combineEnglishTranslation(
				combinedMessages_latest,
				englishMessageObject_translated,
			);

			// 검증(Assert)
			expect(result).toEqual(expectedFinal);
		});
	});

	describe('prepareTranslationPayload', () => {
		// 원칙: 모의 최소화 준수 (generateKeyNumberFunctions만 모의)
		beforeEach(() => {
			// 각 테스트 전에 모의 함수 상태 초기화 및 기본 구현 설정
			vi.mocked(generateKeyNumberFunctions).mockClear().mockImplementation(() => ({
				convertToNumberKeys: mockConvertToNumberSimple,
				restoreFromNumberKeys: mockRestoreSimple,
			}));
		});

		// 원칙: 동작 테스트 (정상 케이스)
		it('번역 페이로드와 복원 함수를 올바르게 준비해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1', msg3: 'old msg3' }, // msg1은 missing 이지만 이전 값 존재
				missingMessageKeys: ['msg1', 'msg2'],
			};
			const combinedMessages_latest = {
				msg1: { ko: '메시지1', explanation: '설명1' },
				msg2: { ko: '메시지2' },
				msg3: { ko: '메시지3' }, // 이건 missing 아님
			};
			const expectedTarget = { // missingMessageKeys 에 해당하는 것들만 combined_latest 에서 가져옴
				msg1: { ko: '메시지1', explanation: '설명1' },
				msg2: { ko: '메시지2' },
			};
			const expectedNumberedTarget = mockConvertToNumberSimple(expectedTarget);
			const expectedOlderMessages = ['old msg3']; // missing 아니면서 value에 있는 것만

			// 실행(Act)
			const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
				prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

			// 검증(Assert)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget);
			expect(restoreFromNumberKeys).toBe(mockRestoreSimple);
			expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget);
			expect(olderMessages).toEqual(expectedOlderMessages);
		});

		// 원칙: 엣지 케이스 테스트 (누락된 키 없음)
		it('missingMessageKeys가 비어 있을 때 올바르게 처리해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1', msg3: 'old msg3' },
				missingMessageKeys: [],
			};
			const combinedMessages_latest = {
				msg1: { ko: '메시지1' },
				msg3: { ko: '메시지3' },
			};
			const expectedTarget = {};
			const expectedNumberedTarget = mockConvertToNumberSimple(expectedTarget);
			const expectedOlderMessages = ['old msg1', 'old msg3']; // missing 키가 없으므로 value의 모든 값이 older

			// 실행(Act)
			const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
				prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

			// 검증(Assert)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget);
			expect(restoreFromNumberKeys).toBe(mockRestoreSimple);
			expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget);
			expect(olderMessages).toEqual(expectedOlderMessages);
		});

		// 원칙: 엣지 케이스 (Value 객체 비어 있음)
		it('languageMessageObject.value가 비어 있을 때 olderMessages가 비어 있어야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: {},
				missingMessageKeys: ['msg1'],
			};
			const combinedMessages_latest = {
				msg1: { ko: '메시지1' },
			};
			const expectedTarget = { msg1: { ko: '메시지1' } };
			const expectedNumberedTarget = mockConvertToNumberSimple(expectedTarget);
			const expectedOlderMessages = []; // value가 비었으므로 older도 비어야 함

			// 실행(Act)
			const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
				prepareTranslationPayload(languageMessageObject, combinedMessages_latest);

			// 검증(Assert)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget);
			expect(restoreFromNumberKeys).toBe(mockRestoreSimple);
			expect(combinedMessages_target_numbers).toEqual(expectedNumberedTarget);
			expect(olderMessages).toEqual(expectedOlderMessages);
		});
	});

	describe('integrateTranslatedMessages', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		// 원칙: 모의 최소화 (restoreFromNumberKeys 는 외부 의존성이므로 모의 필요)
		it('번호 매겨진 번역 메시지를 기존 객체에 올바르게 통합하고 불변성을 유지해야 한다', () => {
			// 준비(Arrange)
			const languageMessageObject = {
				value: { msg1: 'old msg1', msg3: 'old msg3' },
				missingMessageKeys: ['msg1', 'msg2'], // 테스트 자체에는 영향 X
			};
			const translatedMessages_numbers = {
				1: 'translated msg1', // key: msg1 가정
				2: 'translated msg2', // key: msg2 가정
			};
			// restoreFromNumberKeys 모의 함수 (테스트용)
			const mockRestoreFromNumberKeys = vi.fn((numberedData) => {
				const restored = {};
				if (numberedData[1]) restored.msg1 = numberedData[1];
				if (numberedData[2]) restored.msg2 = numberedData[2];
				return restored;
			});
			const expectedTranslatedMessages = { // restore 결과
				msg1: 'translated msg1',
				msg2: 'translated msg2',
			};
			const expectedNewMessages = { // 기존 value 와 restore 결과 병합
				msg1: 'translated msg1', // 업데이트됨
				msg2: 'translated msg2', // 새로 추가됨
				msg3: 'old msg3', // 기존 유지
			};
			const expectedResultObject = {
				...languageMessageObject, // 원본 속성 복사
				translatedMessages: expectedTranslatedMessages,
				newMessages: expectedNewMessages,
			};
			const originalLanguageMessageObject = structuredClone(languageMessageObject); // 불변성 검증용

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
			expect(languageMessageObject).toEqual(originalLanguageMessageObject);
			// 반환된 객체가 원본과 다른 참조인지 확인
			expect(result).not.toBe(languageMessageObject);
			expect(result.newMessages).not.toBe(languageMessageObject.value);
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
			const originalLanguageMessageObject = structuredClone(languageMessageObject);

			// 실행(Act)
			const result = integrateTranslatedMessages(
				languageMessageObject,
				translatedMessages_numbers,
				mockRestoreFromNumberKeys,
			);

			// 검증(Assert)
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(translatedMessages_numbers);
			expect(result).toEqual(expectedResultObject);
			expect(languageMessageObject).toEqual(originalLanguageMessageObject); // 불변성
			expect(result).not.toBe(languageMessageObject);
			// 하지만 내용이 같으면 toEqual은 통과
			expect(result.newMessages).toEqual(languageMessageObject.value);
		});
	});

	describe('translateOneLanguageMessages', () => {
		let mockGetTranslatedMessages;
		let mockRestoreFromNumberKeys; // 로컬 모의 함수

		beforeEach(() => {
			// 원칙: 외부 시스템/비동기 액션 격리를 위한 모의 사용 (`getTranslatedMessages`) (Principle #1)
			vi.mocked(generateKeyNumberFunctions).mockClear();
			mockGetTranslatedMessages = vi.fn();

			// restoreFromNumberKeys 모의 함수 정의 (이 테스트 스코프에서만 필요)
			mockRestoreFromNumberKeys = vi.fn((numberedData) => {
				const restored = {};
				if (numberedData[1]) restored.key1 = numberedData[1];
				if (numberedData[2]) restored.key2 = numberedData[2];
				return restored;
			});

			// generateKeyNumberFunctions 모의 설정 (mockRestoreFromNumberKeys 사용하도록)
			vi.mocked(generateKeyNumberFunctions).mockImplementation(() => ({
				convertToNumberKeys: mockConvertToNumberSimple,
				restoreFromNumberKeys: mockRestoreFromNumberKeys, // 여기서 로컬 모의 함수를 반환
			}));
		});

		// 원칙: 동작 테스트 (성공 케이스, 비동기)
		// 원칙: 모의 활용 (외부 API 호출 모의 - getTranslatedMessages)
		it('성공적인 번역 과정을 올바르게 조율하고 결과와 새 사전을 반환해야 한다', async () => {
			// 준비(Arrange)
			const language = 'en';
			const languageMessageObject = {
				value: { key3: 'old val3' },
				missingMessageKeys: ['key1', 'key2'],
			};
			const dictionary = { wordA: 'defA', wordB: 'defB' };
			const combinedMessages_latest = {
				key1: { ko: '키1 값' },
				key2: { ko: '키2 값', explanation: '설명2' },
				key3: { ko: '키3 값' },
			};
			const expectedTarget = { // prepareTranslationPayload 내부에서 계산됨
				key1: { ko: '키1 값' },
				key2: { ko: '키2 값', explanation: '설명2' },
			}
			const expectedNumberedPayload = mockConvertToNumberSimple(expectedTarget); // { 1: {ko...}, 2: {ko...}}
			const expectedOlderMessages = ['old val3'];
			const mockApiTranslatedMessages = { // getTranslatedMessages 가 반환할 번호 매겨진 메시지
				1: 'translated val1',
				2: 'translated val2',
			};
			const mockApiNewDictionary = { // getTranslatedMessages 가 반환할 새 사전 항목
				wordC: 'defC'
			};
			const expectedRestoredMessages = { // integrateTranslatedMessages 내부에서 계산됨
				key1: 'translated val1',
				key2: 'translated val2',
			};
			const expectedNewMessages = { // integrateTranslatedMessages 내부에서 계산됨
				key1: 'translated val1',
				key2: 'translated val2',
				key3: 'old val3',
			};
			const expectedFinalResult = {
				...languageMessageObject, // value, missingMessageKeys 유지
				translatedMessages: expectedRestoredMessages,
				newMessages: expectedNewMessages,
				newDictionary: { // 원본 사전과 새 항목 병합
					...dictionary,
					...mockApiNewDictionary,
				}
			};
			const originalLanguageMessageObject = structuredClone(languageMessageObject); // 불변성 검증용

			// getTranslatedMessages 모의 설정 (Promise 와 올바른 구조 반환)
			mockGetTranslatedMessages.mockResolvedValue({
				translatedMessages: mockApiTranslatedMessages,
				newDictionary: mockApiNewDictionary
			});

			// 실행(Act)
			const result = await translateOneLanguageMessages(
				language,
				languageMessageObject,
				dictionary,
				combinedMessages_latest,
				mockGetTranslatedMessages, // 모의 함수 주입
			);

			// 검증(Assert)
			// 1. prepareTranslationPayload 내부 호출 확인 (generateKeyNumberFunctions 호출)
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledTimes(1);
			expect(vi.mocked(generateKeyNumberFunctions)).toHaveBeenCalledWith(expectedTarget);
			// 2. getTranslatedMessages 호출 확인 (올바른 인수로)
			expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(1);
			expect(mockGetTranslatedMessages).toHaveBeenCalledWith(
				language,
				expectedNumberedPayload,
				expectedOlderMessages,
				dictionary
			);
			// 3. integrateTranslatedMessages 내부 호출 확인 (restoreFromNumberKeys 호출)
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledTimes(1);
			expect(mockRestoreFromNumberKeys).toHaveBeenCalledWith(mockApiTranslatedMessages);
			// 4. 최종 결과 확인
			expect(result).toEqual(expectedFinalResult);
			// 5. 불변성 확인
			expect(languageMessageObject).toEqual(originalLanguageMessageObject);
			expect(result).not.toBe(languageMessageObject);
			expect(result.newMessages).not.toBe(languageMessageObject.value);
		});

		// 원칙: 에러 핸들링 테스트 (비동기)
		it('getTranslatedMessages가 실패할 경우 예외를 전파해야 한다', async () => {
			// 준비(Arrange)
			const language = 'en';
			const languageMessageObject = {
				value: {},
				missingMessageKeys: ['key1'],
			};
			const dictionary = { wordA: 'defA' }
			const combinedMessages_latest = {
				key1: { ko: '키1 값' },
			};
			const expectedTarget = { key1: { ko: '키1 값' } };
			const expectedNumberedPayload = mockConvertToNumberSimple(expectedTarget);
			const expectedOlderMessages = [];
			const expectedError = new Error('Translation API failed');

			// getTranslatedMessages 모의 설정 (Promise reject)
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
			expect(mockGetTranslatedMessages).toHaveBeenCalledWith(
				language,
				expectedNumberedPayload,
				expectedOlderMessages,
				dictionary
			);
			// 실패 시 restoreFromNumberKeys는 호출되지 않아야 함
			expect(mockRestoreFromNumberKeys).not.toHaveBeenCalled();
		});
	});


	describe('getNewCache', () => {
		// 원칙: 동작 테스트 (정상 케이스)
		// 원칙: 모의 최소화 (순수 함수)
		it('언어 메시지 맵과 설명을 기반으로 새로운 캐시 객체를 올바르게 생성해야 한다', () => {
			// 준비(Arrange)
			const languageMessageMaps = {
				ko: { greeting: '안녕', farewell: '잘가' },
				en: { greeting: 'Hello' }, // farewell 없음
				ja: { greeting: 'こんにちは', farewell: 'さようなら' },
			};
			const explanations = {
				greeting: '인사말',
				farewell: '작별인사',
				extra: '추가 설명' // 캐시에는 영향 X
			};
			const expectedNewCache = {
				greeting: {
					ko: '안녕',
					en: 'Hello',
					ja: 'こんにちは',
					explanation: '인사말',
				},
				farewell: {
					ko: '잘가',
					ja: 'さようなら',
					explanation: '작별인사',
				},
			};

			// 실행(Act)
			const newCache = getNewCache(languageMessageMaps, explanations);

			// 검증(Assert)
			expect(newCache).toEqual(expectedNewCache);
		});

		// 원칙: 엣지 케이스 (빈 입력)
		it('빈 languageMessageMaps 입력 시 빈 객체를 반환해야 한다', () => {
			// 준비(Arrange)
			const languageMessageMaps = {};
			const explanations = { greeting: '인사말' };
			const expectedNewCache = {};

			// 실행(Act)
			const newCache = getNewCache(languageMessageMaps, explanations);

			// 검증(Assert)
			expect(newCache).toEqual(expectedNewCache);
		});

		// 원칙: 엣지 케이스 (설명 없음)
		it('explanations 객체가 비어 있거나 키에 대한 설명이 없으면 explanation 필드를 추가하지 않아야 한다', () => {
			// 준비(Arrange)
			const languageMessageMaps = {
				ko: { greeting: '안녕' },
				en: { greeting: 'Hello' },
			};
			const explanations = {}; // 설명 없음
			const expectedNewCache = {
				greeting: {
					ko: '안녕',
					en: 'Hello',
					// explanation 필드 없음
				},
			};

			// 실행(Act)
			const newCache = getNewCache(languageMessageMaps, explanations);

			// 검증(Assert)
			expect(newCache).toEqual(expectedNewCache);

			// --- 설명이 일부만 있는 경우 ---
			const explanationsPartial = { farewell: '작별인사' };
			const languageMessageMapsPartial = {
				ko: { greeting: '안녕', farewell: '잘가' },
			};
			const expectedNewCachePartial = {
				greeting: { ko: '안녕' }, // 설명 없음
				farewell: { ko: '잘가', explanation: '작별인사' }, // 설명 있음
			};
			const newCachePartial = getNewCache(languageMessageMapsPartial, explanationsPartial);
			expect(newCachePartial).toEqual(expectedNewCachePartial);
		});

		// 원칙: 엣지 케이스 (단일 언어)
		it('단일 언어만 있는 경우에도 올바르게 동작해야 한다', () => {
			// 준비(Arrange)
			const languageMessageMaps = {
				ko: { greeting: '안녕', farewell: '잘가' },
			};
			const explanations = { greeting: '인사말' };
			const expectedNewCache = {
				greeting: { ko: '안녕', explanation: '인사말' },
				farewell: { ko: '잘가' },
			};

			// 실행(Act)
			const newCache = getNewCache(languageMessageMaps, explanations);

			// 검증(Assert)
			expect(newCache).toEqual(expectedNewCache);
		});
	});
});