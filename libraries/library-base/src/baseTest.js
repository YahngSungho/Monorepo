import { describe, expect, it } from 'vitest'

export function runTest() {
	describe('그냥 테스트', () => {
		it('adds 1 + 2 to equal 3', () => {
			expect(1 + 2).toBe(3)
		})
	})
}
