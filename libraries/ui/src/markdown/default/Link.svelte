<script module>
import { localizeHref } from '@library/paraglide/helpers'
import { ExternalLink, FileOutput } from '@lucide/svelte'

import IconText from '../../miscellaneous/icon-text.svelte'

	const newTabProps = {
		rel: 'noopener noreferrer',
		target: '_blank',
	}
</script>

<script>
let { href = '', title = undefined, children } = $props()

const isHeadingLink = $derived(href.startsWith('#'))
const isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>

{#if isHeadingLink}
	<a {href} {title}>
		{@render children?.()}
		<span class="headingLink">#</span>
	</a>
{:else}
	<a href={isInternalLink ? localizeHref(href) : href} {...(isInternalLink ? {} : newTabProps)} {title}>
		<IconText IconElement={isInternalLink ? FileOutput : ExternalLink} noMargin right small>
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
