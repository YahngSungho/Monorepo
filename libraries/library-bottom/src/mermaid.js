const toHex = (c) => ("0" + c.toString(16)).slice(-2);

export function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbStringToHex(rgbString) {
  // "rgb(248, 249, 250)"에서 숫자만 추출하여 배열로 만듭니다.
  const [r, g, b] = rgbString.match(/\d+/g).map(Number);

  return rgbToHex(r, g, b);
}

export function convertTextColors(colorPairs, text) {
	const mappedPairs1 = colorPairs.map(([originalColor, replacementColor]) => {
		return [
			originalColor.replace('rgb', '').replaceAll(' ', '').replace(')', ''),
			replacementColor.replace('rgb', '').replaceAll(' ', '').replace(')', '')
		]
	})

	const mappedPairs2 = colorPairs.map(([originalColor, replacementColor]) => {
		return [
			rgbStringToHex(originalColor),
			rgbStringToHex(replacementColor)
		]
	})

	const resultPairs = mappedPairs1.concat(mappedPairs2)

	let resultText = text;
	for (const pair of resultPairs) {
		// Warn: 순서 중요. 앞에서 이미 바뀐 부분을 다시 바꾸게 될 수 있음.
		resultText = resultText.replaceAll(pair[0], pair[1])
	}

	return resultText;
}

export function convertSVGLight2Dark(svgText) {
	// Warn: 순서 중요. 앞에서 이미 바뀐 부분을 다시 바꾸게 될 수 있음.
	return convertTextColors([
		['rgb(222, 226, 230)', 'rgb(33, 37, 41)'],
		['rgb(3, 5, 7)', 'rgb(222, 226, 230)'],
		['rgb(13, 15, 18)', 'rgb(222, 226, 230)'],
		['rgb(248, 249, 250)', 'rgb(3, 5, 7)'],
		['rgb(194, 37, 92)', 'rgb(247, 131, 172)'],
		['rgb(9, 146, 104)', 'rgb(56, 217, 169)'],
		['rgb(240, 140, 0)', 'rgb(255, 212, 59)'],
	], svgText)
}

/**
 * CSS 변수 참조를 그대로 사용하는 테마 변수 구성
 * (문자열 'var(--...)'를 사용하므로 SSR/CSR 어디서든 안전)
 * @param {string} mode 'light' | 'dark'
 */
export function buildThemeVariables(mode) {
	let accent_background
	let accent_foreground
	let background
	let chart1
	let chart2
	let chart3
	let destructive_background
	let destructive_foreground
	let foreground
	let secondary_background
	let secondary_foreground

	if (mode === 'dark') {
		background = 'rgb(3, 5, 7)'
		foreground = 'rgb(222, 226, 230)'
		secondary_background = 'rgb(33, 37, 41)'
		secondary_foreground = foreground
		accent_background = 'rgb(33, 37, 41)'
		accent_foreground = foreground
		chart1 = 'rgb(247, 131, 172)'
		chart2 = 'rgb(56, 217, 169)'
		chart3 = 'rgb(255, 212, 59)'
		destructive_background = 'rgb(250, 82, 82)'
		destructive_foreground = foreground
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
		primaryBorderColor: foreground,
		primaryColor: background,
		primaryTextColor: foreground,

		// Lines and Edges
		lineColor: foreground,
		textColor: foreground,

		// Secondary
		secondaryBorderColor: secondary_foreground,
		secondaryColor: secondary_background,
		secondaryTextColor: secondary_foreground,

		// Tertiary
		tertiaryBorderColor: accent_foreground,
		tertiaryColor: accent_background,
		tertiaryTextColor: accent_foreground,

		// Notes
		noteBkgColor: background,
		noteBorderColor: foreground,
		noteTextColor: foreground,

		// Flowchart
		clusterBkg: background,
		clusterBorder: foreground,
		defaultLinkColor: foreground,
		edgeLabelBackground: background,
		nodeBorder: foreground,
		nodeTextColor: foreground,
		titleColor: foreground,

		// Sequence Diagram
		activationBkgColor: background,
		activationBorderColor: foreground,
		actorBkg: background,
		actorBorder: foreground,
		actorLineColor: foreground,
		actorTextColor: foreground,
		labelBoxBkgColor: background,
		labelBoxBorderColor: foreground,
		labelTextColor: foreground,
		loopTextColor: foreground,
		sequenceNumberColor: foreground,
		signalColor: foreground,
		signalTextColor: foreground,

		// Other diagrams
		pie1: chart1,
		pie2: chart2,
		pie3: chart3,
		pieLegendTextColor: foreground,
		pieOuterStrokeColor: foreground,
		pieSectionTextColor: foreground,
		pieStrokeColor: foreground,
		pieTitleTextColor: foreground,

		classText: foreground,

		// Errors
		errorBkgColor: destructive_background,
		errorTextColor: destructive_foreground,
	}
}
