<script module>
import { css, cx } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'
import IconText from '@library/ui/icon-text'

import { resolve } from '$app/paths'

/* eslint-disable svelte/no-navigation-without-resolve */

const newTabProperties = {
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
let { children, class: incomingClass = '', href = '', ...rest } = $props()

let isHeadingLink = $derived(href.startsWith('#'))
let isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>

{#if isHeadingLink}
	<a class={cx(linkStyle, incomingClass)} {href} {...rest}>
		<IconText iconName="mdi:hashtag" noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{:else if isInternalLink}
	<a
		class={cx(linkStyle, incomingClass)}
		href={isInternalLink ? resolve(localizeHref(href), {}) : href}
		{...isInternalLink ? {} : newTabProperties}
		{...rest}
	>
		<IconText iconName="mdi:file-document-arrow-right-outline" noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{:else}
	<a
		class={cx(linkStyle, incomingClass)}
		href={isInternalLink ? resolve(localizeHref(href), {}) : href}
		{...isInternalLink ? {} : newTabProperties}
		{...rest}
	>
		<IconText iconName="mdi:external-link" noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{/if}
