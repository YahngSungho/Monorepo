<script module>
import { localizeHref } from '@library/paraglide/helpers'
import { ExternalLink, FileOutput, Hash } from '@lucide/svelte'

import IconText from '../../miscellaneous/icon-text.svelte'

const newTabProps = {
	rel: 'noopener noreferrer',
	target: '_blank',
}
</script>

<script>
let { href = '', title = undefined, children, ...rest } = $props()

const isHeadingLink = $derived(href.startsWith('#'))
const isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
const isFootnoteLink = $derived(href?.startsWith('#user-content-fn'))
</script>

{#if isHeadingLink}
	<a {href} {title} {...rest}>
		{#if isFootnoteLink}
			{@render children?.()}
		{:else}
			<span class="headingLink">
				<IconText IconElement={Hash} noMargin right small>
					{@render children?.()}
				</IconText>
			</span>
		{/if}
	</a>
{:else}
	<a
		href={isInternalLink ? localizeHref(href) : href}
		{...isInternalLink ? {} : newTabProps}
		{title}
		{...rest}
	>
		<IconText IconElement={isInternalLink ? FileOutput : ExternalLink} noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{/if}
