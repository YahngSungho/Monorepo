<script module>
import { css } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'

import IconText from '../../miscellaneous/icon-text.svelte'

const newTabProps = {
	rel: 'noopener noreferrer',
	target: '_blank',
}

const linkStyle = css`
	&:visited iconify-icon {
		color: var(--link-visited) !important;
	}
`
</script>

<script>
let { href = '', children, ...rest } = $props()

let isHeadingLink = $derived(href.startsWith('#'))
let isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
let isFootnoteLink = $derived(href?.startsWith('#user-content-fn'))
</script>

{#if isHeadingLink}
	<a class={linkStyle} {href} {...rest}>
		{#if isFootnoteLink}
			{@render children?.()}
		{:else}
			<span class="headingLink">
				<IconText iconName="mdi:hashtag" noMargin right small>
					{@render children?.()}
				</IconText>
			</span>
		{/if}
	</a>
{:else if isInternalLink}
	<a
		class={linkStyle}
		href={isInternalLink ? localizeHref(href) : href}
		{...isInternalLink ? {} : newTabProps}
		{...rest}
	>
		<IconText iconName="mdi:file-document-arrow-right-outline" noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{:else}
	<a
		class={linkStyle}
		href={isInternalLink ? localizeHref(href) : href}
		{...isInternalLink ? {} : newTabProps}
		{...rest}
	>
		<IconText iconName="mdi:external-link" noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{/if}
