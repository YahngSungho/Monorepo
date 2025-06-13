import mermaid from 'mermaid'

let globalInitPromise
let lastMode // 마지막으로 적용된 테마를 저장할 변수

/**
 * Mermaid.js 테마를 초기화하거나 갱신합니다.
 * 테마 모드('light' 또는 'dark')가 변경될 때마다 다시 호출할 수 있습니다.
 * @param {string | undefined} mode 현재 테마 모드
 */
export function initMermaidTheme_action(mode) {
	// 현재 모드가 이전에 적용된 모드와 같고, 초기화 Promise가 이미 존재하면 재실행하지 않고 반환
	if (globalInitPromise && lastMode === mode) {
		return globalInitPromise
	}
	lastMode = mode // 마지막으로 적용된 모드 갱신

	// 서버 환경에서는 초기화를 건너뛰고 바로 resolve되는 Promise를 반환
	if (typeof document === 'undefined') {
		globalInitPromise = Promise.resolve()
		return globalInitPromise
	}

	// --- 브라우저 환경에서 실행되는 초기화 로직 ---
	// :root 요소에 접근하여 현재 테마에 맞는 CSS 변수 값들을 가져옴
	const rootElement = document.documentElement
	const styles = getComputedStyle(rootElement)

	const background = styles.getPropertyValue('--background').trim()
	const foreground = styles.getPropertyValue('--foreground').trim()
	const secondary_background = styles.getPropertyValue('--secondary').trim()
	const secondary_foreground = styles.getPropertyValue('--secondary-foreground').trim()
	const accent_background = styles.getPropertyValue('--accent').trim()
	const accent_foreground = styles.getPropertyValue('--accent-foreground').trim()
	const chart1 = styles.getPropertyValue('--chart-1').trim()
	const chart2 = styles.getPropertyValue('--chart-2').trim()
	const chart3 = styles.getPropertyValue('--chart-3').trim()
	const destructive_background = styles.getPropertyValue('--destructive').trim()
	const destructive_foreground = styles.getPropertyValue('--destructive-foreground').trim()

	const configs = {
		theme: 'base',
		themeVariables: {
			// General
			background,
			darkMode: false, // 명시적으로 밝은 모드 설정
			fontFamily: 'inherit', // 상위 요소 폰트 상속
			fontSize: 'inherit', // 기본 폰트 크기 (필요시 조정)

			// Primary elements (Nodes, etc.)
			primaryColor: background, // 노드 배경
			primaryBorderColor: foreground, // 노드 테두리
			primaryTextColor: foreground, // 노드 텍스트

			// Lines and Edges
			lineColor: foreground, // 연결선 색상
			textColor: foreground, // 라벨 등 일반 텍스트 색상

			// Secondary (less used in simple diagrams, but set for consistency)
			secondaryColor: secondary_background,
			secondaryBorderColor: secondary_foreground,
			secondaryTextColor: secondary_foreground,

			// Tertiary (less used, set for consistency)
			tertiaryColor: accent_background,
			tertiaryBorderColor: accent_foreground,
			tertiaryTextColor: accent_foreground,

			// Notes
			noteBkgColor: background,
			noteTextColor: foreground,
			noteBorderColor: foreground,

			// Flowchart specific (might override general settings if applicable)
			nodeBorder: foreground,
			clusterBkg: background,
			clusterBorder: foreground,
			defaultLinkColor: foreground,
			titleColor: foreground,
			edgeLabelBackground: background,
			nodeTextColor: foreground,

			// Sequence Diagram specific (set for consistency)
			actorBkg: background,
			actorBorder: foreground,
			actorTextColor: foreground,
			actorLineColor: foreground,
			signalColor: foreground,
			signalTextColor: foreground,
			labelBoxBkgColor: background,
			labelBoxBorderColor: foreground,
			labelTextColor: foreground,
			loopTextColor: foreground,
			activationBorderColor: foreground,
			activationBkgColor: background,
			sequenceNumberColor: foreground,

			// Other diagrams (using primary/secondary/tertiary or specific colors)
			pie1: chart1, // Keep pie1 as the base background color
			pie2: chart2, // Use gray-3 for the second slice
			pie3: chart3, // Use gray-6 for the third slice

			// pie4 and onwards will likely be derived or use defaults.
			// If more explicit control is needed, define pie4: gray9, etc.
			pieTitleTextColor: foreground,
			pieSectionTextColor: foreground,
			pieLegendTextColor: foreground,
			pieStrokeColor: foreground,
			pieOuterStrokeColor: foreground,

			classText: foreground,

			// Ensure error messages are visible using Open Props reds
			errorBkgColor: destructive_background, // Light red background from Open Props
			errorTextColor: destructive_foreground,
		},
	}

	// 새로운 설정으로 Mermaid를 초기화하는 Promise를 생성하여 할당
	globalInitPromise = (async () => {
		if (document.readyState !== 'complete') {
			await new Promise((resolve) => {
				globalThis.addEventListener('DOMContentLoaded', resolve, { once: true })
			})
		}

		// @ts-ignore
		mermaid.initialize(configs)
	})()

	return globalInitPromise
}
