import { generateKeyNumberFunctions } from '@library/helpers/helper-functions'; // Import at top level
import { R } from '@library/helpers/R'; // May be needed for olderMessages calculation
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import necessary helpers for testing orchestration
import * as Helpers from '../helpers.js';
// Import functions being tested
import {
	getTranslatedLanguageMap,
} from './translation.js';


describe('getTranslatedLanguageMap 함수 (비동기 오케스트레이터, 통합 테스트)', () => {
	let mockGetTranslatedMessages; // The external translation function mock

	beforeEach(() => {
		// 모의 처리: 외부 번역 함수
		mockGetTranslatedMessages = vi.fn();
		vi.clearAllMocks();
	});

    afterEach(() => {
        vi.restoreAllMocks();
    });

	it('실제 헬퍼 함수들을 사용하여 영어와 다른 언어를 올바른 순서와 인자로 번역하고 결과를 맵으로 반환해야 한다', async () => {
		// 준비 (Arrange)
		const messageMap = {
			ko: { key1: '하나', key2: '둘' },
			en: { key1: 'One' }, // Missing key2
			fr: { key1: 'Un', key2: 'Deux' }, // Has both keys
		};
		const explanations = { key1: 'Number 1', key2: 'Number 2' };
		const dictPerLanguage = { en: { one: 'one' }, fr: { un: 'un' } };
		// Cache: key1 is same (explanation changed), key2 is new in 'ko'
		const combinedMessages_cached = { key1: { ko: '하나', explanation: 'Old Number 1' } };

        // Mock the external getTranslatedMessages function's return values
        // English call expects key1 (explanation changed) and key2 (new)
        // French call expects key1 (base changed by en) and key2 (base changed by en)
        const enTranslatedPayload = { '1': 'Two' }; // Mocked translation for key1, key2 (mapped to '0', '1')
        const frTranslatedPayload = { '0': 'Un_new', '1': 'Deux_new' }; // Mocked translation for key1, key2 (mapped to '0', '1')
        mockGetTranslatedMessages
            .mockResolvedValueOnce(enTranslatedPayload) // English translation result
            .mockResolvedValueOnce(frTranslatedPayload); // French translation result

		// 실행 (Act)
		const result = await getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages);

		// 검증 (Assert)
        // 1. Verify calls to the external mockGetTranslatedMessages
        expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(2);

        // 2. Verify arguments for the English call (uses actual helpers internally)
        const initialState = Helpers.calculateInitialTranslationStateByBaseLanguages(['ko'], messageMap, explanations, combinedMessages_cached);
        // initialState.targetLanguageMap.en = { value: { key1: 'One' }, missingMessageKeys: ['key1', 'key2'] }
        // initialState.combinedMessages_latest = { key1: { ko:'하나', exp:'Number 1' }, key2: { ko:'둘', exp:'Number 2' } }
        const expectedEnTargetPayload = { key1: initialState.combinedMessages_latest.key1, key2: initialState.combinedMessages_latest.key2 };
        // Use top-level import for generateKeyNumberFunctions
        const enKeyFunctions = generateKeyNumberFunctions(expectedEnTargetPayload);
        const expectedEnOlderMessages = R.values(R.omit(initialState.targetLanguageMap.en.missingMessageKeys, initialState.targetLanguageMap.en.value)); // [] because key1 is missing
		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(1,
			'en',
            enKeyFunctions.convertToNumberKeys(expectedEnTargetPayload),
            expectedEnOlderMessages, // Should be []
			dictPerLanguage.en
		);

        // 3. Verify arguments for the French call
        const enResultIntegrated = Helpers.integrateTranslatedMessages(
            initialState.targetLanguageMap.en,
            enTranslatedPayload,
            enKeyFunctions.restoreFromNumberKeys
        );
        const combinedWithEn = Helpers.combineEnglishTranslation(initialState.combinedMessages_latest, enResultIntegrated);
        // initialState.targetLanguageMap.fr = { value: { key1: 'Un', key2: 'Deux' }, missingMessageKeys: ['key1', 'key2'] }
        const expectedFrTargetPayload = { key1: combinedWithEn.key1, key2: combinedWithEn.key2 };
        // Use top-level import for generateKeyNumberFunctions
        const frKeyFunctions = generateKeyNumberFunctions(expectedFrTargetPayload);
        const expectedFrOlderMessages = R.values(R.omit(initialState.targetLanguageMap.fr.missingMessageKeys, initialState.targetLanguageMap.fr.value)); // [] because key1, key2 missing

		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(2,
			'fr',
            frKeyFunctions.convertToNumberKeys(expectedFrTargetPayload),
            expectedFrOlderMessages, // Should be []
			dictPerLanguage.fr
		);

		// 4. Verify the final result map structure and content (based on actual helpers)
		expect(Object.keys(result)).toEqual(['en', 'fr']);
		expect(result.en.newMessages).toEqual({ key1: 'One', key2: 'Two' }); // Based on enTranslatedPayload
		expect(result.fr.newMessages).toEqual({ key1: 'Un_new', key2: 'Deux_new' }); // Based on frTranslatedPayload
	});

	// --- Error handling tests ---

	it("messageMap에 'en' 키가 없으면 오류를 발생시켜야 한다", async () => {
		// 준비
		const messageMap = { ko: { key1: '하나' }, fr: { key1: 'Un' } }; // 'en' 없음
		const explanations = {};
		const dictPerLanguage = {};
		const combinedMessages_cached = {};

		// 실행 & 검증
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow("English ('en') messages not found in messageMap.");
	});

	it('영어 번역 중 외부 getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비
		const messageMap = { ko: {k:'v'}, en: {k:'v'} };
		const explanations = {};
		const dictPerLanguage = { en: {} };
		const combinedMessages_cached = {};
		const translationError = new Error('External English translation failed');
        mockGetTranslatedMessages.mockRejectedValueOnce(translationError);

		// 실행 & 검증
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(translationError);
	});

	it('다른 언어 번역 중 외부 getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비
		const messageMap = { ko: {k:'v'}, en: {k:'v'}, fr: {k:'v'} };
		const explanations = {};
		const dictPerLanguage = { en: {}, fr: {} };
		const combinedMessages_cached = {};
		const translationError = new Error('External French translation failed');
		mockGetTranslatedMessages
            .mockResolvedValueOnce({}) // English succeeds
            .mockRejectedValueOnce(translationError); // French fails

		// 실행 & 검증
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(translationError);
	});
});
