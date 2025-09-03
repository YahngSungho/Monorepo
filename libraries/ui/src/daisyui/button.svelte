<script module>
import { css, cx } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'

import IconText from '../miscellaneous/icon-text.svelte'

const newTabProps = {
	rel: 'noopener noreferrer',
	target: '_blank',
}
</script>

<script>
/**
 * @typedef {
 * 	| 'primary'
 * 	| 'secondary'
 * 	| 'accent'
 * 	| 'info'
 * 	| 'success'
 * 	| 'warning'
 * 	| 'error'
 * 	| 'outline'
 * 	| 'ghost'
 * 	| 'text'
 * } variant
 *
 * @typedef {
 * | 'xs'
 * | 'sm'
 * | 'md'
 * | 'lg'
 * | 'xl'
 * } size
 *
 * @typedef {
 * | 'wide'
 * | 'block'
 * | 'circle'
 * | 'square'
 * } shape
 *
 * @property {string} [href]
 */
let {
	children = undefined,
	class: incomingClass = '',
	clearBackground = false,
	dimBackground = false,
	href = undefined,
	iconName = '',
	iconProps = {},
	shape = '',
	size = 'md',
	variant = 'primary',
	visibilityHidden = false,
	loading: loadingButton = false,
	...restProps
} = $props()

const btnShape = shape ? `btn-${shape}` : ''
const buttonClass = `btn btn-${variant} btn-${size} ${btnShape}`
const extraStyles1 = css`
	position: relative;
	inset-block-end: 0.15em;
	inset-inline-start: -0.4em;
`
const extraStyles2 = css`
	position: relative;
	inset-block-end: 0.15em;
`

const isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>

{#snippet content()}
{#if loadingButton}
<span style="margin-inline: 1em;" class="loading loading-dots loading-sm"></span>
{:else}
{#if iconName}
	<IconText
		class={children ? extraStyles1 : extraStyles2}
		{iconName}
		{...iconProps}
		alone={!children}>

		{@render children?.()}
		</IconText>
{:else}
		{@render children?.()}
{/if}
{/if}
{/snippet}

{#if href}
	<a
		class:loadingButton
		class={cx(buttonClass, incomingClass)}
		class:clearBackground
		class:dimBackground
		class:icon-only={iconName && !children}
		class:visibilityHidden
		href={isInternalLink ? localizeHref(href) : href}
		role="button"
		type="button"
		{...isInternalLink ? {} : newTabProps}
		class:hoverButton={loadingButton}
		{...restProps}
	>
		{@render content()}
	</a>
{:else}
	<button
		class:loadingButton
		class={cx(buttonClass, incomingClass)}
		class:clearBackground
		class:dimBackground
		class:icon-only={iconName && !children}
		class:visibilityHidden
		type="button"
		class:hoverButton={loadingButton}
		{...restProps}
	>
		{@render content()}
	</button>
{/if}

<style>
.loadingButton {
	cursor: not-allowed !important;
}

.icon-only {
	padding-inline: var(--space-em-cqi-xs-s);
}

.btn-outline {
	border-color: currentcolor;
	border-width: var(--border-size-2);
	background-color: transparent;

	&.btn-xs,
	&.btn-sm {
		border-width: 1px;
	}
}

.btn-text {
	border: none;
	background-color: transparent;
	box-shadow: none;
}

.visibilityHidden {
	visibility: hidden;
}

.dimBackground {
	background-color: color-mix(in oklch, var(--background) 50%, transparent);
}

.clearBackground {
	background-color: var(--background);
}
</style>
