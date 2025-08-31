<script>
import '../../miscellaneous/mermaid/mermaid.css'

import { getSimpleHash, idleRun_action,normalizeString } from '@library/helpers/functions'
import { mode } from 'mode-watcher'
import { getContext, onMount, tick } from 'svelte'

import { initializeMermaidHover_action } from '../../miscellaneous/mermaid/helpers.js'
import { getRawText } from '../getRawText.svelte.js'

const mermaidSVGObject = getContext('mermaidSVGObject')
const rawText = $derived(getRawText())
const hashValue = $derived(getSimpleHash(normalizeString(rawText)))
let mounted = $state(false)
onMount(() => {
	mounted = true
})
const svg = $derived(mounted ? mermaidSVGObject[`${mode.current}:${hashValue}`] : '')

let element = $state()

$effect(() => {
	(async () => {
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

<div bind:this={element} class="mermaid-container">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</div>