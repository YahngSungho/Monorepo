## `universal-testers.js` 인터랙션 확장 가이드

### 목차

1. **서론**: 가이드 목적, 대상 및 주요 고려사항
2. **기존 인터랙션 처리 방식 심층 분석**: 현재 시스템 작동 방식 상세 분석
   - `Interaction` 타입 정의 및 역할
   - 인터랙션 탐색 (`discoverInteractions`, `getInteractionsFromElementInfo`) : 생성 기준 상세화
   - 인터랙션 실행 (`executeInteraction`, `executeInteractionByType`) : 비동기 컨텍스트 및 에러 처리
   - Fast-check 연동 및 시퀀스 생성 (`createInteractionSequenceArbitrary`) : Shrinking 메커니즘 상세 분석
3. **새로운 인터랙션 추가 단계**: 단계별 절차 및 주의점
   - 1단계: `Interaction` 타입 업데이트 (필요시)
   - 2단계: 인터랙션 탐색 로직 수정 (`getInteractionsFromElementInfo`) : 생성 조건 명확화
   - 3단계: 인터랙션 실행 로직 구현 (`executeInteractionByType`) : 상세 에러 처리 및 Playwright 액션
   - 4단계: Fast-check Arbitrary 생성 로직 통합 (`createInteractionSequenceArbitrary`) : Shrinking 유지 패턴 적용
4. **Shrinking 심층 탐구 및 유지 보수**: Fast-check Shrinking 기능 유지 전략
   - Fast-check Shrinking 원리 및 중요성
   - 값(Value) Shrinking (`_getValueArbitraryForType`) : 기본 Arbitrary 활용 및 변환 주의점
   - 대상(Target) 및 종류(Type) Shrinking (`createInteractionSequenceArbitrary`) : 패턴별 Shrinking 방식 분석
   - 새 인터랙션 추가 시 Shrinking 보장 전략
   - Shrinking 테스트 및 검증 방법
5. **주의사항 및 잠재적 문제점**: 안정성 확보를 위한 고려사항
   - 동적 요소 상태 관리 (가시성, 비활성화) 및 타이밍 이슈
   - 비동기 처리 및 Playwright 대기 전략
   - 복잡한 인터랙션의 잠재적 불안정성
   - 강화된 오류 처리 전략
6. **흔히 발생하는 혼동 및 모범 사례**: 일반적인 실수 방지 및 권장 사항
7. **예시: `doubleClick` 인터랙션 추가**: 실제 적용 사례 (개선된 설명 포함)

---

### 1. 서론

이 가이드는 `storybook/e2e/universal-testers.js` 파일에 **새로운 사용자 인터랙션 타입을 추가**하려는 개발자를 대상으로 합니다. 이 파일은 Playwright와 fast-check를 결합하여 Storybook 컴포넌트에 대한 **Property-Based Testing(PBT)**을 수행하며, 다양한 사용자 인터랙션을 자동으로 생성하고 실행합니다.

새로운 인터랙션을 추가하는 과정은 단순히 코드를 추가하는 것 이상으로, fast-check의 핵심 기능인 **shrinking**(실패 원인을 최소화하는 기능)을 유지하는 것이 매우 중요합니다. 또한, Playwright의 비동기적 특성과 브라우저 환경의 동적인 상태 변화를 고려해야 안정적인 테스트를 보장할 수 있습니다. 이 가이드에서는 이러한 점들을 중점적으로 다룹니다.

_(참고: 이 가이드는 `universal-testers.js`의 기존 구조 내에서 인터랙션을 확장하는 데 초점을 맞춥니다. Playwright와 fast-check를 워커(worker) 환경에서 사용하거나, 보다 일반적인 PBT 설정에 대한 내용은 첨부된 `playwright-with-fastCheck.mdc` 문서를 참조하십시오.)_

### 2. 기존 인터랙션 처리 방식 심층 분석

새로운 인터랙션을 효과적으로 추가하려면 현재 시스템의 각 구성 요소가 어떻게 상호작용하는지 정확히 이해해야 합니다.

- **`Interaction` 타입 정의 및 역할**:
  - 파일 상단 주석에 정의된 `@typedef`입니다. 인터랙션 수행에 필요한 모든 정보를 담는 객체의 구조를 정의합니다.
  - `type`: 인터랙션 종류 (문자열, 예: 'click', 'fill'). **새 인터랙션 추가 시 고유한 타입 문자열 정의 필요.**
  - `selector`: Playwright가 상호작용할 대상 요소를 찾는 CSS 셀렉터 (문자열).
  - `value`, `valueType`, `options`, `min`, `max`: 'fill', 'select', 'setRange' 등 특정 타입의 인터랙션에 필요한 추가 데이터.

  - ```

    /**
     * 인터랙션 타입 정의
     * @typedef {Object} Interaction
     * @property {string} type - 인터랙션 타입 (click, fill, select 등). 새 타입 추가 시 고유 식별자.
     * @property {string} selector - 대상 요소의 셀렉터. Playwright가 요소를 찾는 데 사용.
     * @property {any} [value] - 인터랙션에 필요한 값 (fill, select 등에 사용). fast-check가 생성/축소.
     * @property {string} [valueType] - 입력 시 값 타입 (text, email, number, textarea 등). 값 생성 방식 결정.
     * @property {number} [min] - Range 최소값 (setRange에 사용). 값 생성 시 범위 지정.
     * @property {number} [max] - Range 최대값 (setRange에 사용). 값 생성 시 범위 지정.
     * @property {string[]} [options] - Select 옵션 (select에 사용). 선택 가능한 값 목록.
     */

    ```

- **인터랙션 탐색 (`discoverInteractions`, `getInteractionsFromElementInfo`)**:
  - `discoverInteractions`: 현재 페이지의 컴포넌트(`componentSelector`) 내 모든 요소(`*`)를 대상으로 `page.evaluate`를 실행하여 각 요소의 기본 정보(태그명, 속성, 역할 등)와 고유 셀렉터를 추출합니다.
  - `getInteractionsFromElementInfo`: `discoverInteractions`에서 추출한 개별 요소 정보를 바탕으로, **어떤 인터랙션이 가능한지 판단**하고 `Interaction` 객체를 생성합니다.
    - **생성 기준**: 요소의 `tagName` (예: 'button', 'input'), `type` 속성 (예: 'checkbox', 'range'), `role` 속성 (예: 'tab'), 기타 속성 (`draggable`, `hasOnClick`), `disabled` 또는 `readonly` 상태 등을 조합하여 결정합니다.
    - **주의**: 이 단계에서 `disabled` 상태는 체크하지만, `isVisible`은 이후 `executeInteraction`에서 확인합니다. 탐색 시점과 실행 시점 사이의 상태 변화 가능성을 염두에 두어야 합니다.

  - ```

    /**
     * 요소 정보에서 가능한 인터랙션을 생성합니다.
     * @param {object} elementInfo - 요소 정보 객체 (discoverInteractions에서 추출)
     * @returns {Interaction[]} 가능한 인터랙션 목록
     */
    function getInteractionsFromElementInfo(elementInfo) {
    	const interactions = []
    	const {
    		tagName, selector, type, role, disabled, readonly, options, min, max, draggable, hasOnClick,
    	} = elementInfo

    	// 비활성화된 요소에는 인터랙션 생성 안 함
    	if (disabled) return []

    	// 1. 태그 이름 기반 인터랙션 생성
    	switch (tagName) {
    		case 'a':
    		case 'button': {
    			// 클릭/호버 가능 요소
    			interactions.push({ type: 'click', selector }, { type: 'hover', selector })
    			break
    		}
    		case 'input': {
    			// 2. Input 타입 기반 인터랙션 생성
    			switch (type) {
    				case '': case 'email': case 'number': case 'password': case 'search': case 'text': case undefined: {
    					if (!readonly) { // 읽기 전용이 아닐 때만 'fill' 추가
    						interactions.push({ type: 'fill', selector, valueType: type || 'text' })
    					}
    					break
    				}
    				case 'checkbox': case 'radio': {
    					interactions.push({ type: 'click', selector }) // 클릭으로 상태 변경
    					break
    				}
    				case 'range': {
    					interactions.push({ type: 'setRange', selector, min, max }) // 범위 설정 인터랙션
    					break
    				}
    			}
    			break
    		}
    		case 'select': { // Select 태그: 옵션이 있을 때만 'select' 추가
    			if (options.length > 0) {
    				interactions.push({ type: 'select', selector, options })
    			}
    			break
    		}
    		case 'textarea': { // Textarea: 읽기 전용이 아닐 때 'fill' 추가
    			if (!readonly) {
    				interactions.push({ type: 'fill', selector, valueType: 'textarea' })
    			}
    			break
    		}
    	}

    	// 3. 역할(Role) 및 기타 속성 기반 인터랙션 생성
    	if (role === 'button' || hasOnClick) { // 역할이 버튼이거나 onclick 속성 있으면 클릭/호버 추가 (중복될 수 있으나 안전)
    		interactions.push({ type: 'click', selector }, { type: 'hover', selector })
    	}
    	if (['listbox', 'menu', 'tablist'].includes(role)) { // 목록 관련 역할은 클릭 추가
    		interactions.push({ type: 'click', selector })
    	}
    	if (draggable) { // 드래그 가능하면 'drag' 추가
    		interactions.push({ type: 'drag', selector })
    	}

    	// TODO: 새 인터랙션 타입을 위한 조건 추가 위치 (예: 특정 data-* 속성 확인)

    	return interactions
    }

    ```

- **인터랙션 실행 (`executeInteraction`, `executeInteractionByType`)**:
  - `executeInteraction`: fast-check의 `fc.asyncProperty` 내부에서 각 인터랙션 객체를 받아 실행하는 함수입니다.
    - Playwright `locator` 생성 -> `isVisible`, `isDisabled` 재확인 (실행 시점 상태 체크).
    - `executeInteractionByType` 호출하여 실제 액션 수행.
    - Playwright 액션 중 발생할 수 있는 에러 `try...catch`로 처리.
    - `page.waitForTimeout`을 사용한 고정 시간 대기 (주의: 불안정할 수 있음, 후술).
    - 페이지 레벨 에러(`page.on('pageerror')`) 감지 및 로깅.
    - 성공/실패 및 상세 정보를 포함한 `InteractionResult` 객체 반환.
  - `executeInteractionByType`: `interaction.type`에 따라 `switch` 문으로 분기하여 적절한 Playwright 함수(예: `page.click`, `page.fill`, `page.dblclick`)를 호출합니다.
    - 복잡한 로직은 별도 함수(예: `executeFillInteraction`)로 분리되어 있습니다.
    - Playwright 함수 호출 시 `timeout` 옵션을 설정하여 무한 대기 방지.

  - ```

    /**
     * 인터랙션 타입에 따라 적절한 Playwright 액션 실행
     * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
     * @param {Interaction} interaction - 실행할 인터랙션
     * @param {InteractionResult} result - 결과를 저장하고 상태를 업데이트할 객체
     */
    async function executeInteractionByType(page, interaction, result) {
    	try {
    		// interaction.type에 따라 적절한 Playwright 함수 호출
    		switch (interaction.type) {
    			case 'click': {
    				await page.click(interaction.selector, { timeout: 5000 }); // 타임아웃 설정
    				result.message = '클릭';
    				break;
    			}
    			case 'drag': {
    				await page.hover(interaction.selector); // 드래그 시작 위치로 이동
    				await page.dragAndDrop(interaction.selector, interaction.selector, {
    					targetPosition: { x: 10, y: 10 }, // 약간의 오프셋으로 드래그 시뮬레이션
    					timeout: 5000,
    				});
    				result.message = '드래그';
    				break;
    			}
    			case 'fill': { // 값 입력 로직은 별도 함수로 분리
    				await executeFillInteraction(page, interaction, result);
    				break;
    			}
    			case 'hover': {
    				await page.hover(interaction.selector, { timeout: 5000 });
    				result.message = '호버';
    				break;
    			}
    			case 'select': { // 옵션 선택 로직은 별도 함수로 분리
    				await executeSelectInteraction(page, interaction, result);
    				break;
    			}
    			case 'setRange': { // 범위 설정 로직은 별도 함수로 분리
    				await executeRangeInteraction(page, interaction, result);
    				break;
    			}
    			// TODO: 새로운 인터랙션 타입 케이스 추가 위치
    			default: { // 지원하지 않는 타입 처리
    				result.errorMessage = `지원하지 않는 인터랙션 타입: ${interaction.type}`;
    				result.success = false; // 명시적 실패 처리
    				return; // 함수 종료
    			}
    		}
    		// 위 switch 문에서 에러 없이 완료되면 성공으로 간주
    		// eslint-disable-next-line require-atomic-updates
    		result.success = true;
    	} catch (error) { // Playwright 액션 중 발생한 에러 처리
    		console.error(
    			`인터랙션 실행 중 에러 발생 <${interaction.type}> on (${interaction.selector})): ${error.message}`,
    		);
    		// eslint-disable-next-line require-atomic-updates
    		result.errorMessage = error.message;
    		// eslint-disable-next-line require-atomic-updates
    		result.errorStack = error.stack;
    		// eslint-disable-next-line require-atomic-updates
    		result.error = error;
    		// eslint-disable-next-line require-atomic-updates
    		result.success = false; // 명시적 실패 처리
    		// 에러를 throw하지 않고 result 객체에 기록하여 fast-check가 다음 단계를 진행하도록 함
    	}
    }

    ```

- **Fast-check 연동 및 시퀀스 생성 (`createInteractionSequenceArbitrary`)**:
  - PBT의 핵심: `discoverInteractions`로 찾은 모든 가능한 인터랙션들을 기반으로, fast-check가 실행할 **무작위 인터랙션 시퀀스**를 생성하는 `Arbitrary`를 정의합니다.
  - **Shrinking 보장 패턴**:
    - **값이 없는 인터랙션 (click, hover, drag 등)**:
      1. 해당 타입의 인터랙션 목록 필터링 (예: `clickInteractions`).
      2. `fc.nat({ max: 목록길이 - 1 })` : 인터랙션 목록 내에서 대상 요소를 선택할 인덱스를 무작위로 생성하고, 실패 시 이 인덱스를 0에 가깝게 **축소(shrink)**합니다. 즉, **어떤 요소**에 대한 인터랙션이 문제인지 범위를 좁힙니다.
      3. `fc.record` + `fc.map`: 생성된 인덱스를 사용하여 실제 `Interaction` 객체 (타입, 셀렉터 포함)를 만듭니다.
    - **값이 있는 인터랙션 (fill, select, setRange 등)**:
      1. 해당 타입의 인터랙션 목록 필터링.
      2. `for` 루프: 목록 내 각 요소 `i`에 대해 Arbitrary 생성.
      3. `_getValueArbitraryForType`: 해당 인터랙션에 필요한 **값**을 생성하고 **축소(shrink)**하는 Arbitrary를 가져옵니다 (예: `fc.string()`, `fc.integer()`).
      4. `fc.tuple([fc.constant(i), 값Arbitrary])`: 특정 요소 `i` (축소 대상 아님)와 그 요소에 적용될 값(축소 대상)을 묶습니다. fast-check는 실패 시 이 튜플의 **값 부분**을 **축소**합니다.
      5. `.map`: 튜플 데이터를 실제 `Interaction` 객체 (타입, 셀렉터, 값 포함)로 변환합니다.
  - `fc.oneof(...arbitraries)`: 위에서 생성된 모든 종류의 인터랙션 Arbitrary 중 하나를 무작위로 선택합니다. Shrinking 시 더 간단한 타입(내부적 우선순위 따름)으로 시도될 수 있습니다.
  - `fc.array(interactionArb, { minLength: 1, maxLength: ... })`: `fc.oneof`로 생성된 단일 인터랙션 Arbitrary를 사용하여, 인터랙션 **시퀀스(배열)**를 생성합니다. fast-check는 실패 시 이 **배열의 길이를 줄이거나(최소 1개까지), 특정 인터랙션을 제거**하는 방식으로 **축소**합니다.

  - ```

    /**
     * 인터랙션 시퀀스 생성을 위한 fast-check arbitrary 생성. Shrinking을 염두에 두고 설계됨.
     * @param {Interaction[]} interactions - 가능한 모든 인터랙션 목록
     * @param {number} length - 시퀀스 최대 길이에 영향을 주는 파라미터 (실제 길이는 가변적)
     * @returns {fc.Arbitrary<Interaction[]>} 인터랙션 시퀀스 arbitrary
     */
    function createInteractionSequenceArbitrary(interactions, length) {
    	if (interactions.length === 0) {
    		return fc.constant([]); // 인터랙션 없으면 빈 배열 반환
    	}

    	// 1단계: 인터랙션 타입별 분류 (예: clickInteractions, fillInteractions 등)
    	const fillInteractions = interactions.filter((i) => i.type === 'fill');
    	const clickInteractions = interactions.filter((i) => i.type === 'click');
    	// ... (다른 타입들도 분류) ...

    	// 2단계: 각 타입별로 Shrinking 가능한 Arbitrary 생성
    	const arbitraries = []; // 모든 개별 인터랙션 Arbitrary를 담을 배열

    	// 값 없는 인터랙션 (예: click) - 대상 요소 인덱스를 Shrinking
    	if (clickInteractions.length > 0) {
    		const clickInteractionArb = fc
    			.record({
    				type: fc.constant('click'), // 타입은 고정
    				// 대상 요소 인덱스를 0부터 (목록길이-1) 사이에서 생성 및 Shrinking
    				selectorIndex: fc.nat({ max: clickInteractions.length - 1 }),
    			})
    			.map( // 생성된 인덱스를 이용해 실제 Interaction 객체로 변환
    				({ type, selectorIndex }) => ({
    					...clickInteractions[selectorIndex], // 인덱스로 실제 요소 정보 가져옴
    					type,
    				}),
    			);
    		arbitraries.push(clickInteractionArb);
    	}
    	// ... (hover, drag 등 다른 값 없는 타입도 동일 패턴 적용) ...

    	// 값 있는 인터랙션 (예: fill) - 값 자체를 Shrinking
    	if (fillInteractions.length > 0) {
    		// 각 fill 가능 요소에 대해 개별 Arbitrary 생성
    		for (let i = 0; i < fillInteractions.length; i++) {
    			const originalInteraction = fillInteractions[i];
    			const valueType = originalInteraction.valueType || 'text';
    			// 해당 값 타입에 맞는 값 생성 및 Shrinking Arbitrary 가져오기
    			const valueArb = _getValueArbitraryForType(valueType);

    			const fillInteractionArb = fc
    				.tuple( // 특정 요소(i)와 값(valueArb)을 묶음
    					fc.constant(i), // 요소 인덱스는 고정 (Shrinking 대상 아님)
    					valueArb,       // 값은 Shrinking 대상
    				)
    				.map(([index, value]) => ({ // 튜플 데이터를 실제 Interaction 객체로 변환
    					...fillInteractions[index], // 인덱스로 요소 정보 가져옴
    					type: 'fill',
    					value, // Shrinking된 값이 여기에 포함됨
    				}));
    			arbitraries.push(fillInteractionArb);
    		}
    	}
    	// ... (select, setRange 등 다른 값 있는 타입도 동일 패턴 적용) ...

    	// TODO: 새로운 인터랙션 타입에 대한 Arbitrary 생성 로직 추가 위치

    	// 3단계: 모든 개별 인터랙션 Arbitrary 중 하나를 선택하는 Arbitrary 생성
    	const interactionArb = fc.oneof(...arbitraries);

    	// 4단계: 단일 인터랙션 Arbitrary를 이용해 시퀀스(배열) Arbitrary 생성
    	// 배열 길이와 배열 내 요소 제거/순서 변경에 대한 Shrinking 제공
    	return fc.array(interactionArb, {
    		minLength: 1, // 최소 1개 인터랙션은 있도록 보장 (빈 배열 방지)
    		maxLength: Math.max(interactions.length, length), // 최대 길이는 발견된 인터랙션 수와 파라미터 중 큰 값으로 설정 (적절히 조절 가능)
    	});
    }

    ```

### 3. 새로운 인터랙션 추가 단계

다음 단계를 따라 새로운 인터랙션을 체계적으로 추가하고 shrinking을 유지할 수 있습니다.

- **1단계: `Interaction` 타입 업데이트 (필요시)**:
  - 새 인터랙션에 `selector`, `type` 외 추가 정보(예: 좌표, 속성명)가 필요하다면 `Interaction` `@typedef` 주석과 관련 로직에서 사용할 수 있도록 필드를 추가합니다.
  - 예: `setValue(attribute, value)` 인터랙션 -> `{ string } attributeName` 필드 추가. `doubleClick` -> 추가 필드 불필요.
- **2단계: 인터랙션 탐색 로직 수정 (`getInteractionsFromElementInfo`)**:
  - `getInteractionsFromElementInfo` 함수 내에서 **새 인터랙션을 생성할 조건**을 결정하고 코드를 추가합니다.
  - 조건은 HTML 태그(`tagName`), 특정 속성 존재 여부(`elementInfo.hasAttribute('data-custom-attr')`), 역할(`role`), 혹은 이들의 조합이 될 수 있습니다.
  - 해당 조건 만족 시, 정의한 `type`과 `selector`, 그리고 필요한 다른 정보(1단계에서 추가한 필드 값 등)를 포함하는 `Interaction` 객체를 생성하여 `interactions` 배열에 `push`합니다.

  - ```javascript
    // storybook/e2e/universal-testers.js 내 getInteractionsFromElementInfo 함수 수정 예시 (doubleClick)
    
    // ... (기존 switch 문 또는 if 문 내부) ...
    
    // 예시: button 이거나 role='button' 인 요소에 doubleCl((tagName === 'button' || role === 'button') && // 기존 click, hover 외에 doubleClick 추가 (이미 추가되지 않았다면)
    !interactions.some((i) => i.type === 'doubleClick' && i.selector === selector)) {
    	interactions.push({ type: 'doubleClick', selector })
    	console.log(`[Interaction Discovery] Added 'doubleClick' for selector: ${selector}`) // 디버깅 로그 추가
    }`) // 디버깅 로그 추가
    	}
    }
    
    // 예시: data-focusable 속성이 있는 요소에 customFocus 인터랙션 추가
    if (elementInfo.hasAttribute('data-focusable')) {
    	// 'hasAttribute' 사용은 page.evaluate 내 로직 필요
    	// page.evaluate 내에서 elementInfo 객체 생성 시 data-focusable 속성 포함 필요
    	// interactions.push({ type: 'customFocus', selector });
    }
    
    // ...
    ```

- **3단계: 인터랙션 실행 로직 구현 (`executeInteractionByType`)**:
  - `executeInteractionByType` 함수의 `switch` 문에 새로운 `type` 문자열에 대한 `case`를 추가합니다.
  - 해당 `case` 블록 내에서, 인터랙션을 수행하는 **적절한 Playwright 액션 함수** (예: `page.dblclick()`, `page.focus()`, `locator.dragTo()`, `page.evaluate()`)를 호출합니다.
  - **주의사항**:
    - Playwright 액션 호출 시 적절한 `timeout`을 설정하여 무한 대기를 방지합니다.
    - 액션 수행 중 발생할 수 있는 **특 специфичные 에러** (예: `dblclick` 중 요소가 사라짐, `dragTo` 대상이 없음)를 `try...catch`로 감싸고, 에러 발생 시 `result` 객체에 `errorMessage`, `errorStack`, `success = false`를 명확히 기록합니다.
    - 액션 성공 시 `result.message`에 성공 메시지를 기록하고 `result.success = true`를 설정합니다. (try 블록 마지막 또는 catch 이후 finally 블록 활용 가능)
    - 로직이 복잡하면 별도 함수(예: `executeDoubleClickInteraction`)로 분리하는 것이 좋습니다.

  - ```javascript
    // storybook/e2e/universal-testers.js 내 executeInteractionByType 함수 수정 예시 (doubleClick)
    
    async function executeInteractionByType(page, interaction, result) {
    	try {
    		switch (interaction.type) {
    			// ... 기존 case들 ...
    
    			case 'doubleClick': {
    				// 새로운 doubleClick case 추가
    				const locator = page.locator(interaction.selector)
    				// 더블클릭 액션 자체를 try...catch로 감싸서 액션 실패 시 상세 에러 기록
    				try {
    					await locator.dblclick({ timeout: 5000 }) // locator 사용 및 타임아웃 설정
    					result.message = '더블 클릭'
    					// result.success = true; // try 블록 마지막 또는 finally에서 설정
    				} catch (actionError) {
    					console.error(`DoubleClick 액션 실패 (${interaction.selector}): ${actionError.message}`)
    					// result 객체에 액션 관련 에러 상세 기록
    					result.errorMessage = `DoubleClick 실패: ${actionError.message}`
    					result.errorStack = actionError.stack
    					result.error = actionError
    					result.success = false
    					return // 액션 실패 시 함수 종료 (이미 실패 처리됨)
    				}
    				break // switch case 종료
    			}
    
    			// TODO: 다른 새로운 인터랙션 타입 case 추가
    
    			default: {
    				// ... 지원하지 않는 타입 처리 ...
    				result.errorMessage = `지원하지 않는 인터랙션 타입: ${interaction.type}`
    				result.success = false
    				return
    			}
    		}
    		// switch 문 내에서 특정 case가 return되지 않고 break로 빠져나왔다면 성공 간주
    		result.success = true // try 블록의 마지막 부분에서 성공 처리
    	} catch (error) {
    		// switch 문 외부 또는 예상치 못한 에러 처리 (방어적 코드)
    		console.error(
    			`인터랙션 실행 중 예외 발생 <${interaction.type}> on (${interaction.selector})): ${error.message}`,
    		)
    		result.errorMessage = error.message
    		result.errorStack = error.stack
    		result.error = error
    		result.success = false
    	}
    	// finally 블록을 사용하여 success 상태 최종 결정 가능 (옵션)
    	// finally {
    	//    if (!result.errorMessage && result.success === undefined) {
    	//        result.success = true; // 에러 없고 명시적 실패 없으면 성공
    	//    } else if (result.errorMessage) {
    	//        result.success = false; // 에러 있으면 실패
    	//    }
    	// }
    }
    ```

- **4단계: Fast-check Arbitrary 생성 로직 통합 (`createInteractionSequenceArbitrary`)**:
  - `createInteractionSequenceArbitrary` 함수 내 **2단계**(타입별 Arbitrary 생성) 부분에 새 인터랙션 타입을 처리하는 로직을 추가합니다.
  - **값이 없는 인터랙션 (예: `doubleClick`, `customFocus`)**:
    - `click`, `hover`와 **동일한 패턴** (`fc.nat` + `fc.record` + `fc.map`)을 사용합니다. 이는 fast-check가 실패 시 **어떤 요소**에 대한 해당 인터랙션이 문제였는지 인덱스(대상)를 축소할 수 있도록 보장합니다.
  - **값이 있는 인터랙션 (예: `setValue(attr, value)`)**:
    - `fill`, `select`와 **동일한 패턴** (`for` 루프 + `_getValueArbitraryForType` + `fc.tuple` + `fc.map`)을 사용합니다.
    - 필요한 값(예: `attributeName`, `value`)에 대해 shrinking 가능한 Arbitrary를 `_getValueArbitraryForType`에서 가져오거나 새로 정의합니다. (예: `attributeName`은 `fc.constantFrom('id', 'class')`, `value`는 `fc.string()`).
    - `fc.tuple`은 특정 요소 `i`와 shrinking될 값들을 묶어주며, fast-check가 실패 시 **값**을 축소하도록 보장합니다.
  - 생성된 새 인터랙션 Arbitrary를 `arbitraries` 배열에 `push`하면, `fc.oneof`와 `fc.array`에 의해 자동으로 전체 시퀀스 생성 및 shrinking 과정에 포함됩니다.

  - ```javascript
    // storybook/e2e/universal-testers.js 내 createInteractionSequenceArbitrary 함수 수정 예시 (doubleClick)
    
    // ... (1단계: 타입별 분류) ...
    const doubleClickInteractions = interactions.filter((i) => i.type === 'doubleClick')
    // ...
    
    // 2단계: 각 타입별 Arbitrary 생성
    const arbitraries = []
    // ... (기존 click, fill 등 Arbitrary 생성 로직) ...
    
    // doubleClick 인터랙션 Arbitrary 추가 (값 없는 인터랙션 패턴)
    if (doubleClickInteractions.length > 0) {
    	const doubleClickInteractionArb = fc
    		.record({
    			type: fc.constant('doubleClick'), // 타입 고정
    			// 대상 요소 인덱스 생성 및 Shrinking (0 ~ 목록길이-1)
    			selectorIndex: fc.nat({ max: doubleClickInteractions.leselectorIndex, type
    		.map(({ type, selectorIndex }) => ({
    			// 인덱스를 실제 Interaction 객체로 변환
    			...doubleClickInteractions[selectorIndex], // 해당 인덱스의 요소 정보 사용
    			type,
    		}))
    	arbitraries.push(doubleClickInteractionArb) // 생성된 Arbitrary를 배열에 추가
    	console.log(
    		`[Arbitrary Gen] Added 'doubleClick' arbitrary for ${doubleClickInteractions.length} elements.`,
    	) // 디버깅 로그
    }
    
    // 예시: setValue(attr, value) 인터랙션 Arbitrary 추가 (값 있는 인터랙션 패턴)
    /*
      const setValueInteractions = interactions.filter((i) => i.type === 'setValue');
      if (setValueInteractions.length > 0) {
          for (let i = 0; i < setValueInteractions.length; i++) {
              const attrArb = fc.constantFrom('id', 'class', 'data-testid'); // 예시 속성 이름 Arbitrary
              const valueArb = fc.string(1, 20); // 예시 값 Arbitrary
    
              const setValueInteractionArb = fc
                  .tuple(
                      fc.constant(i), // 요소 인덱스 고정
                      attrArb,        // 속성 이름 Shrinking
                      valueArb        // 값 Shrinking
                  )
                  .map(([index, attrName, val]) => ({
                      ...setValueInteractions[index],
                      type: 'setValue',
                      attributeName: attrName, // 1단계에서 추가한 필드 사용
                      value: val,
                  }));
              arbitraries.push(setValueInteractionArb);
          }
      }
      */
    
    // ... (3단계: fc.oneof, 4단계: fc.array) ...
    const interactionArb = fc.oneof(...arbitraries) // 모든 타입 중 하나 선택
    // ...
    ```

### 4. Shrinking 심층 탐구 및 유지 보수

Fast-check의 shrinking 기능은 PBT의 핵심적인 장점입니다. 실패를 유발하는 복잡한 시나리오(긴 시퀀스, 복잡한 값)를 가장 간단한 형태로 줄여주어 디버깅을 용이하게 합니다. 새 인터랙션 추가 시 이 기능을 유지하는 것이 매우 중요합니다.

- **Fast-check Shrinking 원리 및 중요성**:
  - Fast-check는 실패가 발생하면, 실패를 일으킨 입력값(Arbitrary가 생성한 값 또는 시퀀스)을 내부적으로 정의된 규칙에 따라 더 "단순한" 값으로 계속 대체하며 테스트를 반복합니다. 이 과정을 통해 여전히 실패를 유발하는 가장 작은 입력값(counterexample)을 찾아 제시합니다.
  - `fc.string()`은 빈 문자열("")로, `fc.integer()`는 0으로, `fc.array()`는 빈 배열([]) 또는 더 짧은 배열로 줄어들려는 경향이 있습니다. `fc.map`, `fc.tuple`, `fc.oneof` 등도 내부적으로 shrinking 로직을 포함하여 연계적으로 작동합니다.
- **값(Value) Shrinking (`_getValueArbitraryForType`)**:
  - 인터랙션에 사용되는 값(텍스트, 숫자, 선택 옵션 등)의 shrinking은 이 함수에서 반환하는 **기본 Arbitrary**(`fc.string`, `fc.integer`, `fc.constantFrom` 등)에 의해 보장됩니다.
  - **핵심**: 새로운 값 타입을 추가할 때, 가능한 한 fast-check의 **기본 Arbitrary를 직접 사용하거나, 단순한 `.map()` 변환**을 통해 조합해야 합니다.
  - **주의**: `.map()` 내부에서 너무 복잡한 로직(예: 여러 단계의 계산, 외부 상태 의존)을 사용하면 fast-check가 원래 값으로 되돌아가며 shrinking 하는 경로를 찾기 어려워져 shrinking 효율이 떨어지거나 실패할 수 있습니다. `.filter()` 역시 shrinking 성능을 저하시킬 수 있으므로, 가능하면 원하는 값만 생성하는 Arbitrary를 직접 설계하는 것이 좋습니다 (첨부 자료 `playwright-with-fastCheck.mdc`의 Best Practice 3 참조).

  - ```

    // ... 내부 로직 설명 ...
    // 예시: case 'number': return fc.integer(options).map(String);
    // -> fc.integer()가 0으로 shrink -> map(String) 적용 -> "0"으로 shrink 시도
    // 예시: case 'select': return fc.constantFrom(...options.options);
    // -> options 배열의 앞쪽 요소로 shrink 시도
    // 예시: case 'textarea': return fc.string().map(str => `prefix ${str}`);
    // -> fc.string()이 ""로 shrink -> map 적용 -> "prefix "로 shrink 시도

    ```

- **대상(Target) 및 종류(Type) Shrinking (`createInteractionSequenceArbitrary`)**:
  - **대상 Shrinking (어떤 요소?)**:
    - 값 없는 인터랙션: `fc.nat({ max: ... })`가 인덱스를 0에 가깝게 줄여, 시퀀스 실패 시 어떤 요소에 대한 인터랙션이 문제인지 범위를 좁힙니다.
    - 값 있는 인터랙션: `fc.tuple([fc.constant(i), ...])` 패턴에서 요소 인덱스 `i`는 고정되지만, fast-check가 전체 시퀀스를 줄이는 과정(`fc.array`의 shrinking)에서 특정 요소 `i`에 대한 인터랙션 자체가 제거될 수 있습니다.
  - **종류 Shrinking (어떤 인터랙션?)**: `fc.oneof`는 내부적으로 정의된 우선순위에 따라 더 간단한 타입으로 줄이려는 시도를 할 수 있습니다. (이 부분은 black-box에 가까우므로 패턴 준수가 중요)
  - **시퀀스 Shrinking (어떤 순서/길이?)**: `fc.array`가 핵심 역할을 합니다. 실패 시 배열 길이를 줄이거나(minlength까지), 특정 인덱스의 인터랙션을 제거하는 방식으로 가장 짧은 실패 시퀀스를 찾습니다.

- **새 인터랙션 추가 시 Shrinking 보장 전략**:
  - **값을 생성하는가?**: 인터랙션이 외부 값(사용자 입력, 옵션 선택 등)을 필요로 하는지 판단합니다.
  - **값이 없다면**: `click`, `hover`와 동일하게 `fc.nat` + `fc.record` + `fc.map` 패턴을 사용하여 **대상 요소 shrinking**을 보장합니다.
  - **값이 있다면**: `fill`, `select`와 동일하게 `for` 루프 + `_getValueArbitraryForType` + `fc.tuple` + `fc.map` 패턴을 사용하여 **값 shrinking** 및 **대상 요소 shrinking**(시퀀스 레벨에서)을 보장합니다.
  - **복잡한 Arbitrary 생성 회피**: Shrinking을 방해할 수 있는 `fc.letrec`, `fc.chain`의 복잡한 사용은 피하고, 가능한 기본 Arbitrary와 단순 조합을 활용합니다. (첨부 자료 Best Practice 3 참조)
- **Shrinking 테스트 및 검증 방법**:
  - **의도적 실패 유도**: 새로 추가한 인터랙션 실행 후 `expect(true).toBe(false);` 또는 `throw new Error('Intentional failure');`를 임시로 추가하여 `fc.asyncProperty`가 실패하도록 만듭니다.
  - **Counterexample 확인**: 테스트 실행 후 콘솔에 출력되는 `Counterexample:` 섹션을 확인합니다.
  - **검증**: 출력된 counterexample이 예상대로 최소화되었는지 확인합니다. (예: 가장 짧은 시퀀스, 가장 간단한 값 - 빈 문자열, 0, 배열의 첫 요소 등). 축소가 잘 안된다면 Arbitrary 생성 로직, 특히 `.map` 변환이나 값 생성 부분을 검토합니다.
  - **디버깅 활용**: `universal-testers.js`의 `runSingleIteration` 내 `checkResult?.failed` 블록과 `debugWithShrunkExample`, `logShrunkSequence` 함수는 counterexample을 분석하고 디버깅하는 데 유용합니다. Playwright의 trace 기능과 함께 사용하면 더욱 효과적입니다. (첨부 자료 Advanced Techniques 1 참조)

### 5. 주의사항 및 잠재적 문제점

- **동적 요소 상태 관리**:
  - `discoverInteractions` (탐색) 시점과 `executeInteraction` (실행) 시점 사이에 요소의 가시성, 활성화 상태가 변할 수 있습니다 (특히 비동기 UI).
  - `executeInteraction` 내에서 `locator.isVisible()`, `locator.isDisabled()`를 재확인하는 것이 중요합니다.
  - **타이밍 이슈**: 상태 변경을 기다려야 할 때, `page.waitForTimeout` (고정 시간 대기)은 불안정합니다. 가능하면 Playwright의 **명시적 대기**를 사용하세요.
    - `expect(locator).toBeVisible({ timeout: ... })`
    - `locator.waitFor({ state: 'visible', timeout: ... })`
    - `page.waitForFunction(() => document.querySelector(...)?.classList.contains('active'), { timeout: ... })`
    - PBT에서는 어떤 상태를 기다려야 할지 미리 알기 어려울 수 있으므로, 일반적인 로딩 상태나 인터랙션 후 예상되는 변화를 기준으로 대기 전략을 수립해야 합니다. (첨부 자료 Best Practice 2 참조)
- **비동기 처리**: 컴포넌트 내부 로직이 비동기(예: `setTimeout`, API 호출 후 상태 변경)일 경우, 인터랙션 실행 직후 상태 검증이 실패할 수 있습니다. 위에서 언급한 명시적 대기 전략을 사용하여 비동기 작업 완료 후 상태를 확인해야 합니다.
- **복잡한 인터랙션**: 드래그 앤 드롭, 복잡한 키보드 입력 등은 구현 및 테스트 안정성 확보가 더 어렵습니다. Playwright의 관련 API (`dragTo`, `keyboard.press`)를 정확히 사용하고, 실패 시 재현 및 디버깅이 용이하도록 상세 로그를 추가하는 것이 좋습니다.
- **강화된 오류 처리**: `executeInteractionByType` 내 `case` 블록에서 Playwright 액션 호출 시 발생할 수 있는 **구체적인 에러 유형**을 예상하고 처리하면 좋습니다. 예를 들어, 요소가 갑자기 사라져 발생하는 `TimeoutError` 등을 별도로 처리하여 로그 메시지를 더 명확하게 남길 수 있습니다.

### 6. 흔히 발생하는 혼동 및 모범 사례

- **Shrinking 대상**: 값, 대상 요소, 시퀀스 길이/순서가 각각 다른 메커니즘(`_getValueArbitraryForType`, `fc.nat`/`fc.tuple`, `fc.array`)에 의해 축소된다는 점을 명확히 이해해야 합니다.
- **Arbitrary 설계**:
  - **필터링(`fc.filter`) 최소화**: `.filter()`는 원하는 값을 찾을 때까지 많은 값을 버릴 수 있어 성능 저하 및 shrinking 비효율을 유발합니다. 가능하면 원하는 값의 범위나 패턴을 직접 생성하는 Arbitrary를 설계하세요 (예: 특정 형식의 문자열은 `fc.stringMatching` 사용).
  - **`fc.chain` 신중 사용**: 한 값에 의존하여 다음 값을 생성할 때(`fc.chain`) shrinking이 복잡해지거나 제한될 수 있습니다. 꼭 필요한 경우에만 사용하고, shrinking 동작을 충분히 테스트하세요.
- **테스트 범위**: PBT는 단위 테스트나 통합 테스트 수준에서 컴포넌트 자체의 로직과 상태 변화 검증에 가장 효과적입니다. 전체 E2E 흐름에 적용하면 브라우저 인터랙션 비용으로 인해 매우 느려질 수 있습니다. (`playwright-with-fastCheck.mdc` Best Practice 1 참조)
- **테스트 설정 (`TestConfig`)**: `numRuns`, `sequenceLength` 등은 테스트 커버리지와 실행 시간 간의 균형을 맞추도록 조절합니다. CI 환경에서는 시간을 고려하여 `numRuns`를 줄일 수 있습니다. `waitAfterInteraction`은 가능하면 0으로 줄이고 명시적 대기를 사용하는 것이 안정성에 더 좋습니다.

### 7. 예시: `doubleClick` 인터랙션 추가 (개선된 설명 포함)

1. **`Interaction` 타입**: 변경 불필요. (`type: 'doubleClick'`, `selector: string` 만 필요)

2. **`getInteractionsFromElementInfo` 수정**: 클릭 가능한 요소(예: button, a, role=button)를 식별하는 조건에 `doubleClick` 타입 인터랙션 객체 생성 로직 추가.

   ```javascript
   // storybook/e2e/universal-testers.js
   // ... inside getInteractionsFromElementInfo ...
   // 예시: tagName이 'button' 이거나 role이 'button'인 요소에 doubleClick 추가
   if (
   	(tagName === 'button' || role === 'button') && // 이미 click/hover가 추가되었을 수 있음. doubleClick 중복 체크 및 추가
   	!interactions.some((i) => i.type === 'doubleClick' && i.selector === selector)
   ) {
   	interactions.push({ selector, type: 'doubleClick' })
   	// console.log(`[Interaction Discovery] Added 'doubleClick' for: ${selector}`); // 디버깅용 로그
   }
   // ...
   ```

3. **`executeInteractionByType` 수정**: `doubleClick` 케이스 추가. `locator.dblclick()` 호출 및 에러 처리 강화.

   ```javascript
   // storybook/e2e/universal-testers.js
   // ... inside executeInteractionByType ...
           case 'doubleClick': {
             const locator = page.locator(interaction.selector);
             try {
               // dblclick 액션 실행 시도 (적절한 타임아웃 설정)
               await locator.dblclick({ timeout: 5000 });
               result.message = '더블 클릭';
               // 성공 시 result.success는 try 블록 마지막 또는 finally에서 true로 설정됨
             } catch (actionError) {
               // dblclick 액션 자체에서 발생한 에러 처리
               console.error(`DoubleClick 액션 실패 (${interaction.selector}): ${actionError.message}`);
               result.errorMessage = `DoubleClick 실패: ${actionError.message}`;
               result.errorStack = actionError.stack;
               result.error = actionError;
               result.success = false; // 명시적 실패 처리
               return; // 에러 발생 시 이 case 및 함수 종료
             }
             break; // switch case 정상 종료
           }
   // ...
   // try 블록 마지막에서 성공 처리
   result.success = true;
   // ... catch 블록 (기존과 동일) ...
   ```

4. **`createInteractionSequenceArbitrary` 수정**: 값 없는 인터랙션 패턴(`fc.nat` + `fc.record` + `fc.map`) 적용.

   ```javascript
   // storybook/e2e/universal-testers.js
   // ... inside createInteractionSequenceArbitrary ...
   // 1단계: 타입별 분류
   const doubleClickInteractions = interactions.filter((i) => i.type === 'doubleClick')
   // ...
   
   // 2단계: Arbitrary 생성
   const arbitraries = []
   // ... (기존 타입들) ...
   
   // doubleClick Arbitrary 추가 (값 없는 인터랙션 패턴 -> 대상 요소 Shrinking 보장)
   if (doubleClickInteractions.length > 0) {
   	const doubleClickInteractionArb = fc
   		.record({
   			type: fc.constant('doubleClick'), // 타입 고정
   			// 대상 요소 인덱스 생성 및 Shrinking
   			selectorIndex: fc.nat({ max: doubleClickInteractions.length - 1 }),
   		})
   		.map(({ selectorIndex, type }) => ({
   			// 인덱스를 실제 Interaction 객체로 변환
   			...doubleClickInteractions[selectorIndex], // 해당 인덱스의 요소 정보 사용
   			type,
   		}))
   	arbitraries.push(doubleClickInteractionArb)
   	// console.log(`[Arbitrary Gen] Added 'doubleClick' arbitrary`); // 디버깅용 로그
   }
   
   // ... (3단계: fc.oneof, 4단계: fc.array) ...
   const interactionArb = fc.oneof(...arbitraries) // 다른 타입들과 함께 랜덤 선택 대상이 됨
   // ...
   ```

이 개정된 가이드가 `universal-testers.js`에 새로운 인터랙션을 안정적으로 추가하고 fast-check의 강력한 shrinking 기능을 유지하는 데 도움이 되기를 바랍니다.
