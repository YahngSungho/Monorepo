<script>
import '../../miscellaneous/mermaid/mermaid.css'

import { getSimpleHash, idleRun_action, normalizeString } from '@library/helpers/functions'
import { convertSVGLight2Dark } from '@library/library-bottom/mermaid'
import { mode } from 'mode-watcher'
import { getContext } from 'svelte'

import { initializeMermaidHover_action } from '../../miscellaneous/mermaid/helpers.js'
import { getRawText } from '../getRawText.svelte.js'

const mermaid = getContext('mermaidSVGObject')
const scheduleReanchor_action = getContext('scheduleReanchor_action')
const rawText = $derived(getRawText())
const hashValue = $derived(getSimpleHash(normalizeString(rawText)))

const svg = $derived.by(() => {
	const original = mermaid[hashValue] ?? ''
	return mode.current === 'dark' ? convertSVGLight2Dark(original) : original
})

let element = $state()

$effect(() => {
	if (!element || !svg) {
		return
	}

	const svgElement = element?.querySelector('svg') // 렌더링된 SVG 찾기 (element가 있을 때만)
	if (svgElement) {
		if (typeof scheduleReanchor_action === 'function') {
			scheduleReanchor_action()
		}

		idleRun_action(() => initializeMermaidHover_action(svgElement))
	}
})
</script>

<div bind:this={element} class="mermaid-container marginBlock-1">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</div>
