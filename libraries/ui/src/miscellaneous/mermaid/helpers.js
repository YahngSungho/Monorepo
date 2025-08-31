/**
 * CSS 변수 참조를 그대로 사용하는 테마 변수 구성
 * (문자열 'var(--...)'를 사용하므로 SSR/CSR 어디서든 안전)
 * @param {string} mode 'light' | 'dark'
 */
export function buildThemeVariables(mode) {
	let accent_background; let accent_foreground; let background; let chart1; let chart2; let chart3; let destructive_background; let destructive_foreground; let foreground; let secondary_background; let secondary_foreground

	if (mode === 'dark') {
		background = 'rgb(3, 5, 7)'
		foreground = 'rgb(222, 226, 230)'
		secondary_background = 'rgb(33, 37, 41)'
		secondary_foreground = foreground
		accent_background = 'rgb(33, 37, 41)'
		accent_foreground = foreground
		destructive_background = 'rgb(250, 82, 82)'
		destructive_foreground = foreground
		chart1 = 'rgb(247, 131, 172)'
		chart2 = 'rgb(56, 217, 169)'
		chart3 = 'rgb(255, 212, 59)'
	} else {
		background = 'rgb(248, 249, 250)'
		foreground = 'rgb(3, 5, 7)'
		secondary_background = 'rgb(222, 226, 230)'
		secondary_foreground = 'rgb(13, 15, 18)'
		accent_background = 'rgb(222, 226, 230)'
		accent_foreground = 'rgb(13, 15, 18)'
		chart1 = 'rgb(194, 37, 92)'
		chart2 = 'rgb(9, 146, 104)'
		chart3 = 'rgb(240, 140, 0)'
		destructive_background = 'rgb(250, 82, 82)'
		destructive_foreground = foreground
	}

	return {
			// General
			background,
			darkMode: false,
			fontFamily: 'inherit',
			fontSize: 'inherit',

			// Primary elements (Nodes, etc.)
			primaryColor: background,
			primaryBorderColor: foreground,
			primaryTextColor: foreground,

			// Lines and Edges
			lineColor: foreground,
			textColor: foreground,

			// Secondary
			secondaryColor: secondary_background,
			secondaryBorderColor: secondary_foreground,
			secondaryTextColor: secondary_foreground,

			// Tertiary
			tertiaryColor: accent_background,
			tertiaryBorderColor: accent_foreground,
			tertiaryTextColor: accent_foreground,

			// Notes
			noteBkgColor: background,
			noteTextColor: foreground,
			noteBorderColor: foreground,

			// Flowchart
			nodeBorder: foreground,
			clusterBkg: background,
			clusterBorder: foreground,
			defaultLinkColor: foreground,
			titleColor: foreground,
			edgeLabelBackground: background,
			nodeTextColor: foreground,

			// Sequence Diagram
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

			// Other diagrams
			pie1: chart1,
			pie2: chart2,
			pie3: chart3,
			pieTitleTextColor: foreground,
			pieSectionTextColor: foreground,
			pieLegendTextColor: foreground,
			pieStrokeColor: foreground,
			pieOuterStrokeColor: foreground,

			classText: foreground,

			// Errors
			errorBkgColor: destructive_background,
			errorTextColor: destructive_foreground,
	}
}

/**
 * Mermaid 플로우차트 SVG 요소에 노드 hover 시 연결 요소 하이라이트 기능을 초기화합니다.
 * @param {SVGSVGElement} svgElement 대상 Mermaid SVG 요소
 */
export function initializeMermaidHover_action(svgElement) {
	if (!svgElement) {
		console.error('SVG element not provided for Mermaid hover initialization.')
		return
	}

	const nodes = svgElement.querySelectorAll('g.node')
	const edges = svgElement.querySelectorAll('path.flowchart-link') // 플로우차트의 엣지 선택자
	const edgeLabels = svgElement.querySelectorAll('g.edgeLabel') // 엣지 레이블 선택자 추가

	// 엣지와 레이블 수가 다르면 경고 (순서 기반 매핑의 한계)
	if (edges.length !== edgeLabels.length) {
		console.warn(
			`Mermaid Hover: Mismatch between edge count (${edges.length}) and label count (${edgeLabels.length}). Label highlighting might be inaccurate.`,
		)
	}

	if (nodes.length === 0) {
		// 아직 렌더링되지 않았을 수 있으므로 잠시 후 다시 시도
		// console.warn('No nodes found in SVG, retrying initialization shortly...', svgElement.id);
		// setTimeout(() => initializeMermaidHover(svgElement), 300); // 재시도 로직 (필요에 따라 조정)
		return // 혹은 오류 처리
	}

	// 연결 정보 맵핑 (노드 ID를 키로 사용)
	const connections = {}

	// 노드 정보 저장
	for (const nodeEl of nodes) {
		const fullId = nodeEl.id
		// ID 형식: flowchart-노드ID-인덱스 (예: flowchart-A-0)
		const match = fullId.match(/^flowchart-([^-]+)-\d+$/)
		if (match && match[1]) {
			const nodeId = match[1]

			connections[nodeId] = {
				element: nodeEl,
				connectedNodes: new Set(),
				edges: new Set(),
				labels: new Set(), // 연결된 엣지의 레이블을 저장할 Set 추가
			}
		} else {
			console.warn(`Mermaid Hover: Could not parse node ID: ${fullId}`)
		}
	}

	// 엣지 정보 파싱 및 연결 정보 구축 (레이블 포함)
	for (const [index, edgeEl] of edges.entries()) {
		// forEach와 index 사용
		const fullId = edgeEl.id
		// ID 형식: L_시작노드ID_끝노드ID_인덱스 (예: L_A_B_0)
		const match = fullId.match(/^L_([^_]+)_([^_]+)_\d+$/)
		if (match && match[1] && match[2]) {
			const sourceId = match[1]
			const targetId = match[2]
			const correspondingLabel = edgeLabels[index] // 순서 기반으로 레이블 매칭 (주의!)

			// 양방향으로 연결 정보 추가 (hover 효과를 위해)
			if (connections[sourceId] && connections[targetId]) {
				connections[sourceId].connectedNodes.add(targetId)
				connections[sourceId].edges.add(edgeEl)
				if (correspondingLabel) connections[sourceId].labels.add(correspondingLabel) // 레이블 추가

				connections[targetId].connectedNodes.add(sourceId)
				connections[targetId].edges.add(edgeEl)
				if (correspondingLabel) connections[targetId].labels.add(correspondingLabel) // 레이블 추가
			} else {
				console.warn(`Mermaid Hover: Edge connects non-existent node: ${fullId}`)
			}
		} else {
			// console.warn(`Mermaid Hover: Could not parse edge ID: ${fullId}`); // 주석 처리 (엣지가 아닌 경로도 있을 수 있음)
		}
	}

	// 노드에 mouseover 이벤트 리스너 추가
	for (const nodeEl of nodes) {
		nodeEl.addEventListener('mouseover', (event) => {
			const { currentTarget } = event
			if (!(currentTarget instanceof Element)) return

			const fullId = currentTarget.id
			// 정규식을 상수로 정의
			const nodeIdRegex = /^flowchart-([^-]+)-\d+$/
			// exec 사용
			const match = nodeIdRegex.exec(fullId)
			if (!match || !match[1]) return
			const hoveredNodeId = match[1]

			// 모든 노드, 엣지, 레이블을 흐리게 만듦
			for (const n of nodes) n.classList.add('mermaid-dim')
			for (const e of edges) e.classList.add('mermaid-dim')
			for (const l of edgeLabels) l.classList.add('mermaid-dim') // 모든 레이블 흐리게

			// 마우스가 올라간 노드와 연결된 요소들은 다시 밝게 처리
			if (connections[hoveredNodeId]) {
				// 1. Hover된 노드
				connections[hoveredNodeId].element.classList.remove('mermaid-dim')

				// 2. 연결된 노드들
				for (const connectedId of connections[hoveredNodeId].connectedNodes) {
					if (connections[connectedId]) {
						connections[connectedId].element.classList.remove('mermaid-dim')
					}
				}

				// 3. 연결된 엣지들
				for (const edge of connections[hoveredNodeId].edges) {
					edge.classList.remove('mermaid-dim')
				}

				// 4. 연결된 엣지의 레이블들
				for (const label of connections[hoveredNodeId].labels) {
					label.classList.remove('mermaid-dim')
				}
			}
			event.stopPropagation() // 부모 요소(SVG)의 mouseout 이벤트 방지
		})
	}

	// SVG 컨테이너에 mouseout 이벤트 리스너 추가 (요소 간 이동 시 깜빡임 방지)
	svgElement.addEventListener('mouseout', (event) => {
		// relatedTarget이 Node 인스턴스인지 확인하는 타입 가드 추가
		const { relatedTarget } = event
		// 마우스 포인터가 SVG 영역을 벗어났는지 확인
		// relatedTarget이 Node 인스턴스이거나 null일 경우 검사
		if (
			(relatedTarget instanceof Node && !svgElement.contains(relatedTarget)) ||
			relatedTarget === null // 마우스가 창 밖으로 나간 경우 등
		) {
			// 모든 노드, 엣지, 레이블에서 흐림 효과 제거
			for (const n of nodes) n.classList.remove('mermaid-dim')
			for (const e of edges) e.classList.remove('mermaid-dim')
			for (const l of edgeLabels) l.classList.remove('mermaid-dim') // 모든 레이블 밝게
		}
	})

	// 혹시 모를 경우를 대비해 mouseleave 이벤트도 추가
	svgElement.addEventListener('mouseleave', () => {
		// 모든 노드, 엣지, 레이블에서 흐림 효과 제거
		for (const n of nodes) n.classList.remove('mermaid-dim')
		for (const e of edges) e.classList.remove('mermaid-dim')
		for (const l of edgeLabels) l.classList.remove('mermaid-dim') // 모든 레이블 밝게
	})

	// console.log(`Mermaid hover effect initialized for SVG: #${svgElement.id}`);
}