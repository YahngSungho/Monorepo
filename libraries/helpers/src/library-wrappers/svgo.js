import { optimize } from 'svgo'

export function optimizeMermaidSvg(svgString) {
	const result = optimize(svgString, {
		// path: 'path/to/file.svg', // 파일 경로를 사용할 경우
		plugins: [
			{
				name: 'preset-default',
				params: {
					floatPrecision: 0,
					overrides: {
						// -------------------------------------------------
						// JavaScript 상호작용을 위해 반드시 비활성화해야 할 플러그인
						// -------------------------------------------------
						cleanupIds: false, // ID를 변경하거나 제거하지 않음
						collapseGroups: false, // g.node, g.edgeLabel 구조 유지를 위해 그룹을 병합하지 않음
						mergePaths: false, // path.flowchart-link 개수 유지를 위해 경로를 병합하지 않음
						removeEmptyContainers: false, // 빈 g.edgeLabel이 사라져 인덱스 매핑이 깨지는 것을 방지

						// -------------------------------------------------
						// 안전을 위해 비활성화를 강력히 권장하는 플러그인
						// -------------------------------------------------
						removeUnusedNS: false,
						inlineStyles: false, // classList 조작과의 충돌 방지
						sortAttrs: false, // DOM 순서 변경 가능성 방지
						sortDefsChildren: false, // DOM 순서 변경 가능성 방지

						// -------------------------------------------------
						// 용량 최적화를 위해 활성화된 상태로 두는 것이 좋은 플러그인들 (기본값)
						// -------------------------------------------------
						// removeDoctype: true,
						// removeXMLProcInst: true,
						// removeComments: true,
						// removeMetadata: true,
						// ... (대부분의 preset-default 플러그인)

						// -------------------------------------------------
						// 추가적으로 미세 조정할 수 있는 플러그인
						// -------------------------------------------------
						cleanupNumericValues: {
							floatPrecision: 0,
						},
					},
				},
			},
			// preset-default에 포함되지 않았지만 유용한 플러그인이 있다면 여기에 추가
			// 예: 'removeDimensions'
			// {
			//   name: 'removeDimensions',
			//   active: true
			// }
		],
	})

	return result.data
}
