<script>
import '../../miscellaneous/mermaid/mermaid.css'

import { getSimpleHash, normalizeString } from '@library/helpers/functions'
import { mode } from 'mode-watcher'
import { getContext, onMount } from 'svelte'

import { getRawText } from '../getRawText.svelte.js'

const rawText = $derived(getRawText())

console.log('💬 ~ rawText:', rawText)

	const mermaidSVGObject = getContext('mermaidSVGObject')
	const hashValue = getSimpleHash(normalizeString(rawText))
console.log('💬 ~ hashValue:', hashValue)
let mounted = $state(false)
onMount(() => {
	mounted = true
})
const svg = $derived(mounted ? mermaidSVGObject[`${mode.current}:${hashValue}`] : '')
console.log('💬 ~ svg:', svg)
</script>

<div class="mermaid-container">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</div>