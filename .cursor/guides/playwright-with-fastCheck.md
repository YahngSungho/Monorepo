# Guide: Effective Property-Based Testing for UI Components with Playwright and fast-check

```javascript
// # 가이드: 효과적인 Playwright와 fast-check 기반 UI 컴포넌트 테스팅
```

## Introduction

Property-based testing allows you to verify that your UI components maintain certain invariants across a wide range of inputs. When combined with Playwright, fast-check can help you discover edge cases in your UI that traditional example-based testing might miss.

## Setup

```javascript
// # tests/setup/propertyTestSetup.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

// 기본 설정 파일
module.exports = {
	test,
	expect,
	fc,
}
```

## Basic Component Testing Patterns

```javascript
// # tests/components/button.property.spec.js
const { test, expect, fc } = require('../setup/propertyTestSetup')

test('Button should always be accessible with various text lengths', async ({ page }) => {
	await page.goto('/component-playground')

	await fc.assert(
		fc.asyncProperty(
			fc.string({ minLength: 1, maxLength: 100 }).filter((text) => !text.includes('<')), // XSS 방지
			async (buttonText) => {
				// 테스트 컴포넌트 렌더링
				await page.evaluate((text) => {
					window.renderButton(text)
				}, buttonText)

				// 접근성 검사
				const button = await page.locator('button')

				// 버튼이 보이는지 확인
				expect(await button.isVisible()).toBe(true)

				// aria-label이 비어있지 않은지 확인
				const ariaLabel = (await button.getAttribute('aria-label')) || buttonText
				expect(ariaLabel.length).toBeGreaterThan(0)

				// 버튼 텍스트가 화면에 표시되는지 확인
				const displayedText = await button.textContent()
				expect(displayedText).toContain(buttonText)

				return true
			},
		),
		{ numRuns: 25 }, // 25번 테스트 실행
	)
})
```

## Testing Form Components

```javascript
// # tests/components/form.property.spec.js
const { test, expect, fc } = require('../setup/propertyTestSetup')

test('Form should validate inputs correctly across various inputs', async ({ page }) => {
	await page.goto('/form-playground')

	await fc.assert(
		fc.asyncProperty(
			fc.record({
				name: fc.string(1, 50),
				email: fc.oneof(
					fc.emailAddress(), // 유효한 이메일
					fc.string(1, 30), // 유효하지 않을 수 있는 문자열
				),
				age: fc.oneof(
					fc.integer(18, 120), // 유효한 나이
					fc.integer(-10, 500), // 범위 바깥의 나이
				),
			}),
			async (formData) => {
				// 폼 필드 채우기
				await page.fill('#name', formData.name)
				await page.fill('#email', formData.email)
				await page.fill('#age', String(formData.age))

				// 제출 시도
				await page.click('#submit-button')

				// 폼 검증
				const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
				const isAgeValid = formData.age >= 18 && formData.age <= 120

				if (isEmailValid && isAgeValid) {
					// 성공 메시지 확인
					const successMsg = await page.locator('.success-message')
					expect(await successMsg.isVisible()).toBe(true)
				} else {
					// 에러 메시지 확인
					const errorMessages = await page.locator('.error-message').all()
					expect(errorMessages.length).toBeGreaterThan(0)

					if (!isEmailValid) {
						const emailError = await page.locator('.email-error')
						expect(await emailError.isVisible()).toBe(true)
					}

					if (!isAgeValid) {
						const ageError = await page.locator('.age-error')
						expect(await ageError.isVisible()).toBe(true)
					}
				}

				return true
			},
		),
		{ numRuns: 15 },
	)
})
```

## Model-Based Testing with Commands

```javascript
// # tests/components/todoList.model.spec.js
const { test, expect, fc } = require('../setup/propertyTestSetup')

/**
 * Todo 리스트 모델 클래스
 *
 * @class
 */
class TodoListModel {
	constructor() {
		this.todos = []
	}

	/**
	 * Todo 추가
	 *
	 * @param {string} text - Todo 항목 텍스트
	 */
	addTodo(text) {
		this.todos.push({ id: this.todos.length, text, completed: false })
	}

	/**
	 * Todo 완료 상태 토글
	 *
	 * @param {number} id - Todo ID
	 */
	toggleTodo(id) {
		const todo = this.todos.find((t) => t.id === id)
		if (todo) {
			todo.completed = !todo.completed
		}
	}

	/**
	 * Todo 삭제
	 *
	 * @param {number} id - Todo ID
	 */
	removeTodo(id) {
		this.todos = this.todos.filter((t) => t.id !== id)
	}
}

test('TodoList component should match model behavior', async ({ page }) => {
	await page.goto('/todo-app')

	// 명령 정의
	const addTodoCommand = fc.record({
		type: fc.constant('add'),
		text: fc.string(1, 50).filter((s) => !s.includes('<')), // XSS 방지
	})

	const toggleTodoCommand = fc.record({
		type: fc.constant('toggle'),
		id: fc.nat(),
	})

	const removeTodoCommand = fc.record({
		type: fc.constant('remove'),
		id: fc.nat(),
	})

	const commands = fc.commands([addTodoCommand, toggleTodoCommand, removeTodoCommand])

	await fc.assert(
		fc.asyncProperty(commands, async (cmds) => {
			// 모델 생성
			const model = new TodoListModel()

			// 실 UI 상태와 모델 상태 비교 함수
			const checkConsistency = async () => {
				const todosInUI = await page.evaluate(() => {
					const elements = Array.from(document.querySelectorAll('.todo-item'))
					return elements.map((el) => ({
						id: parseInt(el.dataset.id, 10),
						text: el.querySelector('.todo-text').textContent,
						completed: el.classList.contains('completed'),
					}))
				})

				// 모델과 UI의 todo 아이템 수 비교
				expect(todosInUI.length).toBe(model.todos.length)

				// 개별 todo 항목 비교
				for (const modelTodo of model.todos) {
					const uiTodo = todosInUI.find((t) => t.id === modelTodo.id)
					expect(uiTodo).toBeTruthy()
					expect(uiTodo.text).toBe(modelTodo.text)
					expect(uiTodo.completed).toBe(modelTodo.completed)
				}
			}

			// 명령 실행
			for (const cmd of cmds) {
				if (cmd.type === 'add') {
					// 모델 업데이트
					model.addTodo(cmd.text)

					// UI 업데이트
					await page.fill('#new-todo', cmd.text)
					await page.click('#add-todo-btn')
				} else if (cmd.type === 'toggle') {
					if (model.todos.length > 0) {
						const id = cmd.id % model.todos.length

						// 모델 업데이트
						model.toggleTodo(id)

						// UI 업데이트
						await page.click(`.todo-item[data-id="${id}"] .toggle-btn`)
					}
				} else if (cmd.type === 'remove') {
					if (model.todos.length > 0) {
						const id = cmd.id % model.todos.length

						// 모델 업데이트
						model.removeTodo(id)

						// UI 업데이트
						await page.click(`.todo-item[data-id="${id}"] .delete-btn`)
					}
				}

				// 각 작업 후 일관성 확인
				await checkConsistency()
			}

			return true
		}),
		{
			numRuns: 10,
			endOnFailure: true,
		},
	)
})
```

## Testing Response to Window Resize

```javascript
// # tests/responsive/responsive.property.spec.js
const { test, expect, fc } = require('../setup/propertyTestSetup')

test('Responsive layout should adapt correctly to various viewport sizes', async ({ page }) => {
	await fc.assert(
		fc.asyncProperty(
			fc.record({
				width: fc.integer(320, 1920),
				height: fc.integer(500, 1080),
			}),
			async (viewport) => {
				// 뷰포트 크기 설정
				await page.setViewportSize(viewport)

				// 테스트할 페이지로 이동
				await page.goto('/responsive-page')

				// 반응형 요소 확인
				if (viewport.width < 768) {
					// 모바일 레이아웃 확인
					const mobileMenu = await page.locator('.mobile-menu')
					expect(await mobileMenu.isVisible()).toBe(true)

					const desktopMenu = await page.locator('.desktop-menu')
					expect(await desktopMenu.isVisible()).toBe(false)
				} else {
					// 데스크톱 레이아웃 확인
					const desktopMenu = await page.locator('.desktop-menu')
					expect(await desktopMenu.isVisible()).toBe(true)

					const mobileMenu = await page.locator('.mobile-menu')
					expect(await mobileMenu.isVisible()).toBe(false)
				}

				// 컨텐츠가 화면에 맞게 조정되는지 확인
				const contentContainer = await page.locator('.content-container')
				const containerBounds = await contentContainer.boundingBox()

				// 컨테이너가 뷰포트 내에 있는지 확인
				expect(containerBounds.width).toBeLessThanOrEqual(viewport.width)

				return true
			},
		),
		{ numRuns: 20 },
	)
})
```

## Tips and Best Practices

1. **Limit test runs**: For UI tests, keep `numRuns` relatively low (10-50) to avoid long test times.

2. **Use small, composable arbitraries**: Build complex test cases from simple generators.

3. **Implement shrinking strategies**: When a test fails, fast-check will try to find the minimal failing example. Help it by using appropriate filters.

4. **Add replay capability**:

```javascript
// # tests/replay-example.js
// 실패 케이스 재현
fc.assert(
  fc.property(
    /* your arbitraries */,
    checkFunction
  ),
  {
    seed: 123456789, // 실패한 테스트의 시드
    path: '42:3', // 실패한 테스트의 경로
    endOnFailure: true
  }
);
```

5. **Model-based testing**: For complex components, maintain a simplified model as shown in the TodoList example.

6. **Component isolation**: Test components in isolation using component playground pages.

7. **Handle asynchronous UI updates**: Always wait for UI updates to complete before making assertions.

## Common Pitfalls to Avoid

1. **Too complex generators**: Overly complex arbitrary generators can make failures hard to understand.

2. **Flaky tests**: Ensure your tests handle UI timing correctly with proper waiting.

3. **Test interdependence**: Each property test should be independent to avoid cascade failures.

4. **Performance issues**: Property-based UI tests can be slow; optimize by:

   - Using headless mode
   - Batching UI interactions where possible
   - Limiting test runs for larger components

5. **Missing error reporting**: Always include clear failure messages to understand what property was violated.

## Conclusion

Property-based testing with Playwright and fast-check offers a powerful way to discover edge cases in your UI components. By defining invariants that should hold true across many input variations, you can build more robust frontends that handle unexpected user behaviors gracefully.
