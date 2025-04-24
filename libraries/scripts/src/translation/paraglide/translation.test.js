import { generateKeyNumberFunctions } from '@library/helpers/helper-functions'; // 최상위 레벨에서 임포트
import { R } from '@library/helpers/R'; // olderMessages 계산에 필요할 수 있음
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 테스트 오케스트레이션을 위한 필수 헬퍼 임포트
import * as Helpers from '../helpers.js';
// 테스트 대상 함수 임포트
import {
	getTranslatedLanguageMap,
} from './translation.js';


describe('getTranslatedLanguageMap 함수 (비동기 오케스트레이터, 통합 테스트)', () => {
	let mockGetTranslatedMessages; // 외부 번역 함수 모의 객체

	beforeEach(() => {
		// 원칙: 모의 함수 호출 기록 초기화
		mockGetTranslatedMessages = vi.fn();
		vi.clearAllMocks();
	});

    afterEach(() => {
		// 원칙: 모의 복원
        vi.restoreAllMocks();
    });

	// 원칙: 동작 테스트 (공개 API 및 협력자와의 통합)
	it('실제 헬퍼 함수들을 사용하여 영어와 다른 언어를 올바른 순서와 인자로 번역하고 결과를 맵으로 반환해야 한다', async () => {
		// 준비 (Arrange)
		// 원칙: 명확성을 위해 리터럴 값 사용
		const messageMap = {
			ko: { key1: '하나', key2: '둘' },
			en: { key1: 'One' }, // key2 누락
			fr: { key1: 'Un', key2: 'Deux' }, // 두 키 모두 존재
		};
		const explanations = { key1: 'Number 1', key2: 'Number 2' };
		const dictPerLanguage = { en: { one: 'one' }, fr: { un: 'un' } };
		// 캐시: key1은 동일 (설명 변경), key2는 'ko'에서 새로 추가됨
		const combinedMessages_cached = { key1: { ko: '하나', explanation: 'Old Number 1' } };

		// 원칙: 극단적 모의 최소화 - 외부 시스템 경계(getTranslatedMessages)만 모의
		// 정당화: getTranslatedMessages는 외부 API 호출 등 I/O를 포함할 가능성이 높아 모의 대상임.
        const enTranslatedPayload = {translatedMessages: { '0': 'One', '1': 'Two' }, newDictionary: dictPerLanguage.en}; // key1, key2에 대한 모의 번역 ('0', '1'로 매핑됨)
        const frTranslatedPayload = {translatedMessages: { '0': 'Un_new', '1': 'Deux_new' }, newDictionary: dictPerLanguage.fr}; // key1, key2에 대한 모의 번역 ('0', '1'로 매핑됨)
        mockGetTranslatedMessages
            .mockResolvedValueOnce(enTranslatedPayload) // 영어 번역 결과
            .mockResolvedValueOnce(frTranslatedPayload); // 프랑스어 번역 결과

		// 실행 (Act)
		const result = await getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages);

		// 검증 (Assert)
		// 1. 외부 모의 함수(mockGetTranslatedMessages) 호출 횟수 검증
        expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(2);

		// 2. 영어 호출 인자 검증 (내부적으로 실제 헬퍼 사용)
		// 원칙: 극단적 모의 최소화 - 내부 헬퍼 함수는 실제 구현 사용
        const initialState = Helpers.calculateInitialTranslationStateByBaseLanguages(['ko'], messageMap, explanations, combinedMessages_cached);
        // initialState.targetLanguageMap.en = { value: { key1: 'One' }, missingMessageKeys: ['key1', 'key2'] } // 이 부분 주석은 테스트 코드 내부 계산값으로, 실제 내부 상태를 나타낼 수 있음
        // initialState.combinedMessages_latest = { key1: { ko:'하나', exp:'Number 1' }, key2: { ko:'둘', exp:'Number 2' } }
        const expectedEnTargetPayload = { key1: initialState.combinedMessages_latest.key1, key2: initialState.combinedMessages_latest.key2 };
        const enKeyFunctions = generateKeyNumberFunctions(expectedEnTargetPayload); // 최상위 임포트 사용
        // 영어 value에는 key1만 있고 missing은 key1, key2이므로, olderMessages는 빈 객체여야 함
        const expectedEnOlderMessages = R.values(R.omit(initialState.targetLanguageMap.en.missingMessageKeys, initialState.targetLanguageMap.en.value));
		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(1,
			'en',
            enKeyFunctions.convertToNumberKeys(expectedEnTargetPayload),
            expectedEnOlderMessages, // [] 이어야 함
			dictPerLanguage.en
		);

		// 3. 프랑스어 호출 인자 검증
		// 원칙: 극단적 모의 최소화 - 내부 헬퍼 함수는 실제 구현 사용
        const enResultIntegrated = Helpers.integrateTranslatedMessages(
            initialState.targetLanguageMap.en,
            enTranslatedPayload.translatedMessages,
            enKeyFunctions.restoreFromNumberKeys // restoreFromNumberKeys가 필요함
        );
        const combinedWithEn = Helpers.combineEnglishTranslation(initialState.combinedMessages_latest, enResultIntegrated);
        // initialState.targetLanguageMap.fr = { value: { key1: 'Un', key2: 'Deux' }, missingMessageKeys: ['key1', 'key2'] }
        const expectedFrTargetPayload = { key1: combinedWithEn.key1, key2: combinedWithEn.key2 };
        const frKeyFunctions = generateKeyNumberFunctions(expectedFrTargetPayload); // 최상위 임포트 사용
        // 프랑스어 value에는 key1, key2가 모두 있고 missing도 key1, key2이므로, olderMessages는 빈 객체여야 함
        const expectedFrOlderMessages = R.values(R.omit(initialState.targetLanguageMap.fr.missingMessageKeys, initialState.targetLanguageMap.fr.value));

		expect(mockGetTranslatedMessages).toHaveBeenNthCalledWith(2,
			'fr',
            frKeyFunctions.convertToNumberKeys(expectedFrTargetPayload),
            expectedFrOlderMessages, // [] 이어야 함
			dictPerLanguage.fr
		);

		// 4. 최종 결과 맵 구조 및 내용 검증 (실제 헬퍼 기반)
		expect(Object.keys(result)).toEqual(['en', 'fr']);
		// 영어 번역 결과 반영 확인: enTranslatedPayload의 '1' ('key2')가 'Two'로 번역되고, 기존 'key1'은 유지되어야 함.
		// Helpers.integrateTranslatedMessages 로직에 따라 결정됨.
		// integrateTranslatedMessages는 missing 키에 대해 translatedMessages를 사용함.
		// enTarget.value = { key1: 'One' } / enTarget.missing = ['key1', 'key2']
		// enTranslatedPayload = { '1': 'Two' } -> restore 하면 { key2: 'Two' }
		// 결과: { key1: 'One', key2: 'Two' }
		expect(result.en.newMessages).toEqual({ key1: 'One', key2: 'Two' });
		// 프랑스어 번역 결과 반영 확인: frTranslatedPayload에 따라 결정됨.
		// frTarget.value = { key1: 'Un', key2: 'Deux' } / frTarget.missing = ['key1', 'key2']
		// frTranslatedPayload = { '0': 'Un_new', '1': 'Deux_new' } -> restore 하면 { key1: 'Un_new', key2: 'Deux_new' }
		// 결과: { key1: 'Un_new', key2: 'Deux_new' }
		expect(result.fr.newMessages).toEqual({ key1: 'Un_new', key2: 'Deux_new' });
	});

	// --- 오류 처리 테스트 --- //
	// 원칙: 부정 케이스 / 에러 핸들링 테스트

	it("messageMap에 'en' 키가 없으면 오류를 발생시켜야 한다", async () => {
		// 준비(Arrange)
		const messageMap = { ko: { key1: '하나' }, fr: { key1: 'Un' } }; // 'en' 없음
		const explanations = {};
		const dictPerLanguage = {};
		const combinedMessages_cached = {};

		// 실행(Act) & 검증(Assert)
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow("English ('en') messages not found in messageMap.");
	});

	// 원칙: 외부 시스템 오류 시나리오 테스트
	it('영어 번역 중 외부 getTranslatedMessages가 실패하면 오류를 전파해야 한다', async () => {
		// 준비(Arrange)
		const messageMap = { ko: {k:'v'}, en: {k:'v'} };
		const explanations = {};
		const dictPerLanguage = { en: {} };
		const combinedMessages_cached = {};
		const translationError = new Error('External English translation failed');
        mockGetTranslatedMessages.mockRejectedValueOnce(translationError); // 영어 번역 실패 모의

		// 실행(Act) & 검증(Assert)
		await expect(getTranslatedLanguageMap(messageMap, explanations, dictPerLanguage, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(translationError); // 동일한 오류가 전파되는지 확인
	});
});
