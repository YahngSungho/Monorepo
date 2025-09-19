<script>
import '../../miscellaneous/mermaid/mermaid.css'

import { getSimpleHash, idleRun_action, normalizeString } from '@library/helpers/functions'
import { mode } from 'mode-watcher'
import { getContext, tick } from 'svelte'

import { initializeMermaidHover_action } from '../../miscellaneous/mermaid/helpers.js'
import { getRawText } from '../getRawText.svelte.js'

const mermaid = getContext('mermaidSVGObject')
const rawText = $derived(getRawText())
const hashValue = $derived(getSimpleHash(normalizeString(rawText)))

const svg = $derived(mermaid[`${mode.current}:${hashValue}`] ?? '')

let element = $state()

$effect(() => {
	;(async () => {
		if (!element || !svg) return
		await tick()
		const svgElement = element?.querySelector('svg') // 렌더링된 SVG 찾기 (element가 있을 때만)
		if (svgElement) {
			// 4) Hover 초기화는 유휴 시간에 지연 수행하여 초기 페인트 방해 최소화
			idleRun_action(() => initializeMermaidHover_action(svgElement))
		}
	})()
})
</script>

<div bind:this={element} class="mermaid-container marginBlock-1">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</div>
