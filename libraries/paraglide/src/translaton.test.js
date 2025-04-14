import { describe, expect, it, vi } from 'vitest';

import { getTranslatedLanguageMap, getTranslatedMessages_forTest } from './translation'; // 테스트 대상 함수

// Principle: Helper Function for Mocking - 복잡하고 반복적인 모의 함수 설정을 위한 도우미
// Note: 이 헬퍼는 테스트의 핵심 로직을 숨기지 않으며, getTranslatedMessages의 예상 동작을 명확히 합니다.
const createMockGetTranslatedMessages = (translations) => {
	return vi.fn(async (language, combinedMessages_numbers) => {
		// Principle: Mocking behavior - 실제 네트워크 호출 대신 미리 정의된 번역 반환
		const mockResult = {};
		for (const numKey of Object.keys(combinedMessages_numbers)) {
			// 실제 함수가 할 것으로 예상되는 동작을 모방 (여기서는 간단히 언어 코드 접두사 추가)
			// 실제 테스트에서는 시나리오에 맞는 더 구체적인 모의 응답 사용 가능

            // 실제 테스트에서는 `translations` 객체 구조와 `combinedMessages_numbers`의 내용을 기반으로
            // 더 정확한 매핑 로직이 필요할 수 있습니다.
            // 이 예제에서는 단순화를 위해, 숫자 키가 오면 해당 언어의 모든 'mock translation'을 반환합니다.
            // 좀 더 정확하게는, numbersToMessageKeysMap 로직을 모의에서 재현해야 합니다.
            // 하지만 함수 시그니처만 테스트하므로, 일단은 단순화합니다.
            // 더 나은 접근: combinedMessages_numbers의 키를 사용하여 원래 메시지 키를 식별하고 해당 번역을 반환합니다.
            // 이 예제에서는 단순하게 첫 번째 찾은 키의 번역을 사용합니다.

            // 데모 목적의 단순화된 로직: 실제 번역을 찾지 않고 고정 문자열 반환
             mockResult[numKey] = `[${language}] Mock Translation for key ${numKey}`;


		}
		return mockResult;
	});
};


describe('getTranslatedLanguageMap', () => {
	// Principle: Test Behavior, NOT Implementation (Public API focus)
	// 테스트는 getTranslatedLanguageMap의 입력과 출력(반환 값) 및 모의된 getTranslatedMessages 호출에 중점을 둡니다.

	// --- Happy Path Scenarios ---

	it('should return empty object when no target languages are provided', async () => {
		// Principle: Edge Case Testing
		// Arrange - Principle: Inline setup for clarity
		const messageMap = {
			en: { msg1: 'Hello' },
			ko: { msg1: '안녕' },
			explanations: { msg1: 'Greeting' },
		};
		const combinedMessages_cached = {
			msg1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
		};
		const mockGetTranslatedMessages = vi.fn(); // 호출되지 않아야 함

		// Act
		const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

		// Assert
		expect(result).toEqual({}); // 대상 언어가 없으므로 빈 객체 반환
		expect(mockGetTranslatedMessages).not.toHaveBeenCalled(); // 번역 함수 호출 없음
	});

	it('should return data for target languages with no missing keys if cache is up-to-date and languages are complete', async () => {
		// Principle: Happy Path & Testing Behavior (No translation needed)
		// Arrange
		const messageMap = {
			en: { msg1: 'Hello', msg2: 'World' },
			ko: { msg1: '안녕', msg2: '세상' },
			explanations: { msg1: 'Greeting', msg2: 'Place' },
			fr: { msg1: 'Bonjour', msg2: 'Monde' }, // Target language, complete
		};
		const combinedMessages_cached = { // Cache is up-to-date
			msg1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
			msg2: { en: 'World', ko: '세상', explanation: 'Place' },
		};
		const mockGetTranslatedMessages = vi.fn(); // 호출되지 않아야 함

		// Act
		const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

		// Assert
		expect(result).toHaveProperty('fr');
		expect(result.fr.missingMessageKeys).toEqual([]); // 누락 키 없음
		expect(result.fr.value).toEqual({ msg1: 'Bonjour', msg2: 'Monde' }); // 원본 값 유지
		expect(result.fr).not.toHaveProperty('translatedMessages'); // 번역 결과 없음
		expect(result.fr).not.toHaveProperty('newMessages'); // 새 메시지 객체 없음 (create 미호출)
		expect(mockGetTranslatedMessages).not.toHaveBeenCalled();
	});

	it('should identify missing keys due to new/changed messages in en/ko/explanation', async () => {
		// Principle: Testing Behavior (Identifying changes)
		// Arrange
		const messageMap = {
			en: { msg1: 'Hello New', msg2: 'World', msg3: 'New Key' }, // msg1 changed, msg3 added
			ko: { msg1: '안녕 새롭게', msg2: '세상', msg3: '새 키' },
			explanations: { msg1: 'New Greeting', msg2: 'Place', msg3: 'A new key' },
			fr: { msg1: 'Bonjour', msg2: 'Monde' }, // Target language, msg1 exists, msg2 exists
		};
		const combinedMessages_cached = { // Cache is outdated for msg1, missing msg3
			msg1: { en: 'Hello Old', ko: '안녕 오래됨', explanation: 'Old Greeting' },
			msg2: { en: 'World', ko: '세상', explanation: 'Place' },
		};
        const mockTranslations = {
            fr: {
                 msg1: {en: "Hello New", ko: "안녕 새롭게", explanation: "New Greeting"},
                 msg3: {en: "New Key", ko: "새 키", explanation: "A new key"}
            }
        }
		const mockGetTranslatedMessages = createMockGetTranslatedMessages(mockTranslations);


		// Act
		const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

		// Assert
		expect(result).toHaveProperty('fr');
		// msg1 (changed) and msg3 (new) should be missing
		expect(result.fr.missingMessageKeys).toEqual(['msg1', 'msg3']);
		expect(mockGetTranslatedMessages).toHaveBeenCalledOnce();
		// Principle: Testing Behavior (Interaction with dependency)
        // 검증: 모의 함수가 올바른 언어와 예상 구조의 메시지 객체로 호출되었는지 확인
        // 참고: 내부적으로 숫자 키로 변환되므로, 정확한 인자 검증은 복잡할 수 있습니다.
        // 여기서는 호출 여부와 호출 언어만 확인합니다.
		expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
            // 숫자로 변환된 키 (0, 1) 확인
            '0': { en: 'Hello New', ko: '안녕 새롭게', explanation: 'New Greeting' },
            '1': { en: 'New Key', ko: '새 키', explanation: 'A new key' }
        }));

        // 번역 결과 확인 (모의 함수 기반)
        expect(result.fr.translatedMessages).toEqual({
            msg1: '[fr] Mock Translation for key 0', // 모의 함수가 반환한 값
            msg3: '[fr] Mock Translation for key 1'
        });

        // Principle: Testing Behavior (State update via mutative)
        // create 함수 호출 결과 확인 (모의 처리 없이 실제 동작 검증)
        expect(result.fr.newMessages).toEqual({
            msg1: '[fr] Mock Translation for key 0', // 번역된 값으로 업데이트됨
            msg2: 'Monde',                         // 기존 값 유지
            msg3: '[fr] Mock Translation for key 1'  // 새로 추가됨
        });
	});

    it('should identify missing keys because target language lacks them', async () => {
        // Principle: Testing Behavior (Identifying missing keys in target)
        // Arrange
        const messageMap = {
            en: { msg1: 'Hello', msg2: 'World' }, // msg2 exists in en/ko
            ko: { msg1: '안녕', msg2: '세상' },
            explanations: { msg1: 'Greeting', msg2: 'Place' },
            fr: { msg1: 'Bonjour' }, // Target language, missing msg2
        };
        const combinedMessages_cached = { // Cache is up-to-date
            msg1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
            msg2: { en: 'World', ko: '세상', explanation: 'Place' },
        };
         const mockTranslations = {
            fr: {
                msg2: { en: "World", ko: "세상", explanation: "Place" }
            }
        }
		const mockGetTranslatedMessages = createMockGetTranslatedMessages(mockTranslations);

        // Act
        const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

        // Assert
        expect(result).toHaveProperty('fr');
        expect(result.fr.missingMessageKeys).toEqual(['msg2']); // msg2 is missing in 'fr'
        expect(mockGetTranslatedMessages).toHaveBeenCalledOnce();
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
            '0': { en: 'World', ko: '세상', explanation: 'Place' } // msg2 data
        }));
        expect(result.fr.translatedMessages).toEqual({
            msg2: '[fr] Mock Translation for key 0' // 모의 번역 결과
        });
        expect(result.fr.newMessages).toEqual({
            msg1: 'Bonjour',                       // 기존 값
            msg2: '[fr] Mock Translation for key 0' // 번역된 값으로 추가됨
        });
    });

    it('should handle multiple target languages with different missing keys', async () => {
        // Principle: Testing Behavior (Multiple targets, combined scenarios)
        // Arrange
        const messageMap = {
            en: { msg1: 'Hello New', msg2: 'World', msg3: 'Key3' }, // msg1 changed
            ko: { msg1: '안녕 새롭게', msg2: '세상', msg3: '키3' },
            explanations: { msg1: 'New Greeting', msg2: 'Place', msg3: 'Third Key' },
            fr: { msg1: 'Bonjour', msg2: 'Monde' }, // Missing msg3, needs update for msg1
            de: { msg2: 'Welt', msg3: 'Taste3' }, // Missing msg1 (needs update)
        };
        const combinedMessages_cached = { // msg1 outdated, msg3 exists in cache
            msg1: { en: 'Hello Old', ko: '안녕 오래됨', explanation: 'Old Greeting' },
            msg2: { en: 'World', ko: '세상', explanation: 'Place' },
            msg3: { en: 'Key3', ko: '키3', explanation: 'Third Key' },
        };

         const mockTranslations = {
            fr: {
                msg1: {en: "Hello New", ko: "안녕 새롭게", explanation: "New Greeting"},
                msg3: {en: "Key3", ko: "키3", explanation: "Third Key"}
            },
            de: {
                 msg1: {en: "Hello New", ko: "안녕 새롭게", explanation: "New Greeting"}
            }
        }
		const mockGetTranslatedMessages = createMockGetTranslatedMessages(mockTranslations);

        // Act
        const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

        // Assert
        // French assertions
        expect(result).toHaveProperty('fr');
        expect(result.fr.missingMessageKeys).toEqual(['msg1', 'msg3']); // msg1 changed, msg3 missing
        expect(result.fr.translatedMessages).toEqual({
            msg1: '[fr] Mock Translation for key 0',
            msg3: '[fr] Mock Translation for key 1'
        });
        expect(result.fr.newMessages).toEqual({
            msg1: '[fr] Mock Translation for key 0',
            msg2: 'Monde',
            msg3: '[fr] Mock Translation for key 1'
        });

        // German assertions
        expect(result).toHaveProperty('de');
        expect(result.de.missingMessageKeys).toEqual(['msg1']); // msg1 changed (and was missing)
         expect(result.de.translatedMessages).toEqual({
            msg1: '[de] Mock Translation for key 0'
        });
         expect(result.de.newMessages).toEqual({
            msg1: '[de] Mock Translation for key 0',
            msg2: 'Welt',
            msg3: 'Taste3'
        });

        // Check mock calls
        expect(mockGetTranslatedMessages).toHaveBeenCalledTimes(2);
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
            '0': { en: 'Hello New', ko: '안녕 새롭게', explanation: 'New Greeting' },
            '1': { en: 'Key3', ko: '키3', explanation: 'Third Key' },
        }));
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('de', expect.objectContaining({
            '0': { en: 'Hello New', ko: '안녕 새롭게', explanation: 'New Greeting' },
        }));
    });


	// --- Error / Edge Case Scenarios ---

	it('should handle empty combinedMessages_cached gracefully', async () => {
		// Principle: Edge Case Testing
		// Arrange
		const messageMap = {
			en: { msg1: 'Hello' },
			ko: { msg1: '안녕' },
			explanations: { msg1: 'Greeting' },
			fr: { msg1: 'Bonjour' },
		};
		const combinedMessages_cached = {}; // Empty cache
        const mockTranslations = { fr: { msg1: { en: "Hello", ko: "안녕", explanation: "Greeting" } } };
		const mockGetTranslatedMessages = createMockGetTranslatedMessages(mockTranslations);

		// Act
		const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

		// Assert
		expect(result.fr.missingMessageKeys).toEqual(['msg1']); // Cache is empty, so msg1 is treated as 'missing' for comparison
		expect(mockGetTranslatedMessages).toHaveBeenCalledOnce();
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
             '0': { en: 'Hello', ko: '안녕', explanation: 'Greeting' }
        }));
        expect(result.fr.translatedMessages).toEqual({ msg1: '[fr] Mock Translation for key 0' });
        expect(result.fr.newMessages).toEqual({ msg1: '[fr] Mock Translation for key 0' }); // Updated from mock
	});

	it('should propagate errors from getTranslatedMessages', async () => {
		// Principle: Testing Behavior (Error propagation)
		// Arrange
		const messageMap = {
			en: { msg1: 'Hello' },
			ko: { msg1: '안녕' },
			explanations: { msg1: 'Greeting' },
			fr: {}, // Missing msg1
		};
		const combinedMessages_cached = {
			msg1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
		};
		const expectedError = new Error('Translation API Failed');
		const mockGetTranslatedMessages = vi.fn().mockRejectedValue(expectedError); // Mock function throws

		// Act & Assert
        // Principle: Use Vitest's 'rejects' matcher for async errors
		await expect(getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages))
			.rejects.toThrow(expectedError); // 함수가 모의 함수의 에러를 그대로 전파해야 함

        expect(mockGetTranslatedMessages).toHaveBeenCalledOnce(); // 호출 시도 확인
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
            '0': { en: 'Hello', ko: '안녕', explanation: 'Greeting' }
        }))
	});

    it('should handle target languages with initially empty message objects', async () => {
        // Principle: Edge Case Testing
        // Arrange
        const messageMap = {
            en: { msg1: 'Hello' },
            ko: { msg1: '안녕' },
            explanations: { msg1: 'Greeting' },
            fr: {}, // Target language starts empty
        };
        const combinedMessages_cached = { // Cache is up-to-date
             msg1: { en: 'Hello', ko: '안녕', explanation: 'Greeting' },
        };
        const mockTranslations = { fr: { msg1: { en: "Hello", ko: "안녕", explanation: "Greeting" } } };
		const mockGetTranslatedMessages = createMockGetTranslatedMessages(mockTranslations);

        // Act
        const result = await getTranslatedLanguageMap(messageMap, combinedMessages_cached, mockGetTranslatedMessages);

        // Assert
        expect(result).toHaveProperty('fr');
        expect(result.fr.missingMessageKeys).toEqual(['msg1']); // msg1 is missing in 'fr' value object
        expect(result.fr.value).toEqual({}); // Original value was empty
        expect(mockGetTranslatedMessages).toHaveBeenCalledOnce();
        expect(mockGetTranslatedMessages).toHaveBeenCalledWith('fr', expect.objectContaining({
             '0': { en: 'Hello', ko: '안녕', explanation: 'Greeting' }
        }));
        expect(result.fr.translatedMessages).toEqual({ msg1: '[fr] Mock Translation for key 0' });
        expect(result.fr.newMessages).toEqual({ msg1: '[fr] Mock Translation for key 0' }); // New object created with translated key
    });

});

// Dummy test for the test helper function itself (optional, but good practice)
describe('getTranslatedMessages_forTest', () => {
	it('should return dummy translations', async () => {
        // Principle: Simple test for helper/dummy function if included in the file
        // Arrange
        const language = 'testLang';
        const combinedMessages = { key1: 'data1', key2: 'data2' };

        // Act
        const result = await getTranslatedMessages_forTest(language, combinedMessages);

        // Assert
        expect(result).toEqual({
            key1: '번역된 메시지',
            key2: '번역된 메시지',
        });
    });
});
