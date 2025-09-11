<svelte:options css="injected" />

<script>
	import Markdown from '../markdown/blog/Markdown.svelte'
	import '@library/base/base.css'
	import 'iconify-icon'
	// Warn: layouts/root.svelte에 default로 가져오는 게 늘으면 여기도 추가해야 할 수 있음

	let { value, mermaidSVGObject = {} } = $props()
</script>

<div class="boxed long-text">
	<Markdown value={value} mermaidSVGObject={mermaidSVGObject} />
</div>