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
		const regex = /^flowchart-([^-]+)-\d+$/
		const match = regex.exec(fullId)
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
		const regex = /^L_([^_]+)_([^_]+)_\d+$/
		const match = regex.exec(fullId)
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