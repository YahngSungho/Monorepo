<script>
import Icon from '../../custom/icon.svelte'

let { href = '', title = undefined, children } = $props()

const isHeadingLink = $derived(href.startsWith('#'))
</script>

{#if isHeadingLink}
	<a {href} {title}>
		{@render children?.()}
		<span class="headingLink">#</span>
	</a>
{:else}
	<a {href} rel="noopener noreferrer" target="_blank" {title}>
		<Icon icon="carbon:link" noMargin right small>
			{@render children?.()}
		</Icon>
	</a>
{/if}

<style>
.headingLink {
	display: inline-block;
	margin-inline-start: -0.5ch;
}
</style>
