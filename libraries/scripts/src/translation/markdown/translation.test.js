import { beforeEach,describe, expect, it, vi } from 'vitest';

import {
	translateOneLanguageMessages,
} from '../helpers.js';
import {
	convertMarkdownFiles,
	getTranslatedLanguageMap,
} from './translation.js';

// --- 모의 설정 ---
vi.mock('../helpers.js', async (importOriginal) => {
	/** @type { { calculateInitialTranslationStateByBaseLanguages: function, translateOneLanguageMessages: function } } */
	const actual = await importOriginal();
	return {
		// 실제 모듈의 모든 내보내기를 명시적으로 복사합니다.
		// calculateInitialTranslationStateByBaseLanguages는 실제 구현을 사용해야 하므로 여기에 포함합니다.
		calculateInitialTranslationStateByBaseLanguages: actual.calculateInitialTranslationStateByBaseLanguages,
		translateOneLanguageMessages: vi.fn(), // 이 함수만 모의
		// 다른 필요한 내보내기가 있다면 여기에 추가합니다.
	};
});

// --- 테스트 스위트 ---

describe('convertMarkdownFiles 함수', () => {
	// 원칙: 동작 테스트 (공개 API), 모의 최소화 (순수 함수, 모의 불필요)
	it('마크다운 파일 배열을 언어 메시지 맵과 설명 맵으로 올바르게 변환해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = [
			{ path: 'src/comp/text/ko.md', value: '안녕' },
			{ path: 'src/comp/text/en.md', value: 'Hello' },
			{ path: 'src/comp/text/explanation.md', value: '인사말' },
			{ path: 'src/comp/other/ko.md', value: '세상' },
			{ path: 'src/comp/other/en.md', value: 'World' },
			// 설명 파일이 없는 경우
			{ path: 'src/comp/extra/fr.md', value: 'Bonjour' },
			{ path: 'src/comp/extra/ko.md', value: '봉주르' }, // 중복 키는 덮어씀
			{ path: 'src/comp/text.txt', value: '무시됨' }, // 비 마크다운 파일
		];
		const initialLanguageMessageMap = { ko: {}, en: {}, fr: {} };
		const expectedLanguageMap = {
			ko: { 'src/comp/text': '안녕', 'src/comp/other': '세상', 'src/comp/extra': '봉주르' },
			en: { 'src/comp/text': 'Hello', 'src/comp/other': 'World' },
			fr: { 'src/comp/extra': 'Bonjour' },
		};
		const expectedExplanations = {
			'src/comp/text': '인사말',
		};

		// 실행 (Act)
		const result = convertMarkdownFiles(initialMarkdownFiles, initialLanguageMessageMap);

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap);
		expect(result.explanations).toEqual(expectedExplanations);
	});

	// 원칙: 엣지 케이스 테스트
	it('입력 파일 배열이 비어있을 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = [];
		const initialLanguageMessageMap = { ko: {}, en: {} };
		const expectedLanguageMap = { ko: {}, en: {} };
		const expectedExplanations = {};

		// 실행 (Act)
		const result = convertMarkdownFiles(initialMarkdownFiles, initialLanguageMessageMap);

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap);
		expect(result.explanations).toEqual(expectedExplanations);
	});

	// 원칙: 엣지 케이스 테스트
	it('초기 언어 맵에 없는 언어 파일도 처리해야 한다', () => {
		// 준비 (Arrange)
		const initialMarkdownFiles = [{ path: 'src/new/de.md', value: 'Hallo' }];
		const initialLanguageMessageMap = { ko: {}, en: {} }; // de 없음
		const expectedLanguageMap = { ko: {}, en: {} }; // 초기 맵에 없으면 추가되지 않음
		const expectedExplanations = {};

		// 실행 (Act)
		const result = convertMarkdownFiles(initialMarkdownFiles, initialLanguageMessageMap);

		// 검증 (Assert)
		expect(result.languageMessageMap).toEqual(expectedLanguageMap);
		expect(result.explanations).toEqual(expectedExplanations);
		// 초기 맵에 없는 언어는 languageMessageMap에 추가되지 않음을 확인
		expect(result.languageMessageMap.de).toBeUndefined();
	});
});

describe('getTranslatedLanguageMap 함수', () => {
	// 원칙: 동작 테스트 (오케스트레이션 로직), 모의 사용 (translateOneLanguageMessages)

	// 모의 함수 반환값 설정
	const mockTranslateResultFr = {
		newMessages: { key1: 'Bonjour traduit', key2: 'Monde traduit' },
		// ... 다른 필드들
	};
	const mockTranslateResultDe = {
		newMessages: { key1: 'Hallo übersetzt', key2: 'Welt übersetzt' },
		// ... 다른 필드들
	};

	beforeEach(() => {
		// 원칙: 명확성을 위해 각 테스트 전에 모의 초기화
		vi.clearAllMocks();

		// translateOneLanguageMessages 모의 설정
		// R.cond와 유사하게 언어별 다른 결과 반환 설정
		vi.mocked(translateOneLanguageMessages).mockImplementation(async (language, ...args) => {
			if (language === 'fr') {
				return mockTranslateResultFr;
			}
			if (language === 'de') {
				return mockTranslateResultDe;
			}
			return { newMessages: {} }; // 기본값
		});
	});

	it('각 대상 언어에 대해 translateOneLanguageMessages를 호출하고 결과를 집계해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			ko: { key1: '안녕', key2: '세상' },
			en: { key1: 'Hello', key2: 'World' },
			fr: { key1: 'Bonjour' },
			de: {},
		};
		const explanations = { key1: '인사', key2: '대상' };
		const dictPerLanguage = { fr: { word: 'mot' }, de: { word: 'Wort' } };
		const combinedMessages_cached = {};
		// 실제 getTranslatedMessages 대신 더미 함수 전달 (translateOneLanguageMessages가 모의되었으므로 직접 사용되지 않음)
		const dummyGetTranslatedMessages = vi.fn();

		const expectedCombinedLatest = {
			key1: { ko: '안녕', en: 'Hello', explanation: '인사' },
			key2: { ko: '세상', en: 'World', explanation: '대상' },
		};
		const expectedTargetLanguageMapForCalc = {
			fr: { value: { key1: 'Bonjour' }, missingMessageKeys: ['key1', 'key2'] },
			de: { value: {}, missingMessageKeys: ['key1', 'key2'] },
		};

		// 실행 (Act)
		const result = await getTranslatedLanguageMap(
			messageMap,
			explanations,
			dictPerLanguage,
			combinedMessages_cached,
			dummyGetTranslatedMessages, // 실제론 사용되지 않음
		);

		// 검증 (Assert)
		// 1. translateOneLanguageMessages 호출 검증
		expect(translateOneLanguageMessages).toHaveBeenCalledTimes(2); // fr, de
		expect(translateOneLanguageMessages).toHaveBeenCalledWith(
			'fr',
			expectedTargetLanguageMapForCalc.fr, // languageMessage 객체
			dictPerLanguage.fr,
			expectedCombinedLatest,
			dummyGetTranslatedMessages,
		);
		expect(translateOneLanguageMessages).toHaveBeenCalledWith(
			'de',
			expectedTargetLanguageMapForCalc.de, // languageMessage 객체
			dictPerLanguage.de,
			expectedCombinedLatest,
			dummyGetTranslatedMessages,
		);

		// 2. 최종 결과 검증 (모의된 결과가 집계되었는지 확인)
		expect(result).toEqual({
			fr: mockTranslateResultFr,
			de: mockTranslateResultDe,
		});
	});

	it('번역할 대상 언어가 없을 경우 빈 객체를 반환해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			ko: { key1: '안녕' },
			en: { key1: 'Hello' },
			// fr, de 등 다른 언어 없음
		};
		const explanations = { key1: '인사' };
		const dictPerLanguage = {};
		const combinedMessages_cached = {};
		const dummyGetTranslatedMessages = vi.fn();

		// 실행 (Act)
		const result = await getTranslatedLanguageMap(
			messageMap,
			explanations,
			dictPerLanguage,
			combinedMessages_cached,
			dummyGetTranslatedMessages,
		);

		// 검증 (Assert)
		expect(translateOneLanguageMessages).not.toHaveBeenCalled();
		expect(result).toEqual({});
	});
});
