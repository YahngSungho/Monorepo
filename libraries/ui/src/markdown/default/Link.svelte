<script>
import { ExternalLink } from '@lucide/svelte';

import IconText from '../../custom/icon-text.svelte'

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
		<IconText IconElement={ExternalLink} noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{/if}

<style>
.headingLink {
	display: inline-block;
	margin-inline-start: -0.5ch;
}
</style>
