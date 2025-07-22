<script module>
import { css } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'
import { ExternalLink, FileOutput, Hash } from '@lucide/svelte'

import IconText from '../../miscellaneous/icon-text.svelte'

const newTabProps = {
	rel: 'noopener noreferrer',
	target: '_blank',
}

const linkStyle = css`
	&:visited .icon-container {
		color: var(--link-visited) !important;

		& path,
		& svg {
			color: var(--link-visited) !important;
		}
	}
`

function scrollToTop() {
	setTimeout(() => {
		window.scrollTo({
			top: 0,
			behavior: 'instant',
		})
		document.body.scrollTo({
			top: 0,
			behavior: 'instant',
		})
	}, 1)
}
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
				<IconText IconElement={Hash} noMargin right small>
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
		onclick={scrollToTop}
	>
		<IconText IconElement={FileOutput} noMargin right small>
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
		<IconText IconElement={ExternalLink} noMargin right small>
			{@render children?.()}
		</IconText>
	</a>
{/if}
