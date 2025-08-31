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