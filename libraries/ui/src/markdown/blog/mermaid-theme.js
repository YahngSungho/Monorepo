import mermaid from 'mermaid'
// import OpenProps from 'open-props' // 사용하지 않으므로 제거

// Define colors based on Open Props (converted to Hex)
const white = '#FFFFFF' // rgb(248 249 250)
const gray0 = '#F8F9FA' // rgb(248 249 250)
const gray3 = '#DEE2E6' // --gray-3: rgb(222 226 230)
const gray6 = '#868E96' // --gray-6: rgb(134 142 150)
const gray9 = '#212529' // --gray-9: rgb(33 37 41)
const gray12 = '#030507' // --gray-12: rgb(3 5 7)
const red1 = '#FFE3E3' // --red-1: rgb(255 227 227)
const red9 = '#C92A2A' // --red-9: rgb(201 42 42)

export function initMermaidTheme() {
	mermaid.initialize({
		theme: 'base',
		themeVariables: {
			// General
			background: white,
			darkMode: false, // 명시적으로 밝은 모드 설정
			fontFamily: 'inherit', // 상위 요소 폰트 상속
			fontSize: 'inherit', // 기본 폰트 크기 (필요시 조정)

			// Primary elements (Nodes, etc.)
			primaryColor: white, // 노드 배경
			primaryBorderColor: gray12, // 노드 테두리
			primaryTextColor: gray12, // 노드 텍스트

			// Lines and Edges
			lineColor: gray12, // 연결선 색상
			textColor: gray12, // 라벨 등 일반 텍스트 색상

			// Secondary (less used in simple diagrams, but set for consistency)
			secondaryColor: gray3,
			secondaryBorderColor: gray12,
			secondaryTextColor: gray12,

			// Tertiary (less used, set for consistency)
			tertiaryColor: gray9,
			tertiaryBorderColor: gray0,
			tertiaryTextColor: gray0,

			// Notes
			noteBkgColor: white,
			noteTextColor: gray12,
			noteBorderColor: gray12,

			// Flowchart specific (might override general settings if applicable)
			nodeBorder: gray12,
			clusterBkg: white,
			clusterBorder: gray12,
			defaultLinkColor: gray12,
			titleColor: gray12,
			edgeLabelBackground: white,
			nodeTextColor: gray12,

			// Sequence Diagram specific (set for consistency)
			actorBkg: white,
			actorBorder: gray12,
			actorTextColor: gray12,
			actorLineColor: gray12,
			signalColor: gray12,
			signalTextColor: gray12,
			labelBoxBkgColor: white,
			labelBoxBorderColor: gray12,
			labelTextColor: gray12,
			loopTextColor: gray12,
			activationBorderColor: gray12,
			activationBkgColor: white,
			sequenceNumberColor: gray12,

			// Other diagrams (using primary/secondary/tertiary or specific colors)
			pie1: white, // Keep pie1 as the base background color
			pie2: gray3, // Use gray-3 for the second slice
			pie3: gray6, // Use gray-6 for the third slice
			// pie4 and onwards will likely be derived or use defaults.
			// If more explicit control is needed, define pie4: gray9, etc.
			pieTitleTextColor: gray12,
			pieSectionTextColor: gray12,
			pieLegendTextColor: gray12,
			pieStrokeColor: gray12,
			pieOuterStrokeColor: gray12,

			classText: gray12,

			// Ensure error messages are visible using Open Props reds
			errorBkgColor: red1, // Light red background from Open Props
			errorTextColor: red9, // Dark red text from Open Props
		},
	})
}
