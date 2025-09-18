export const blockClient_action = () => {
	// eslint-disable-next-line sonarjs/different-types-comparison
	const isBrowser = globalThis?.window !== undefined && document !== undefined
	if (isBrowser) {
		throw new Error('클라이언트 노출')
	}
}
