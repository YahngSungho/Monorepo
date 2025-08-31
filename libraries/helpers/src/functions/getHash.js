export const getSimpleHash = (str) => {
	let hash = 0
	for (const character of str) {
		const char = character.codePointAt(0)
		hash = (hash << 5) - hash + char
		hash &= hash // 32비트 정수로 변환
	}
	return hash
}
