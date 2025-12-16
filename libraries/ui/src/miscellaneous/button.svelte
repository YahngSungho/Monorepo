<script module>
import { css, cx } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'
import IconText from '@library/ui/icon-text'

import { resolve } from '$app/paths'

/* eslint-disable svelte/no-navigation-without-resolve */

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
	loading: loadingButton = false,
	notTransparent = false,
	shape = '',
	size = 'md',
	variant = 'primary',
	visibilityHidden = false,
	...restProps
} = $props()

const buttonShape = $derived(shape ? `btn-${shape}` : '')
const buttonClass = $derived(`btn btn-${variant} btn-${size} ${buttonShape}`)
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
		<span style:margin-inline="1em" class="loading loading-dots loading-sm"></span>
	{:else if iconName}
		<IconText
			class={children ? extraStyles1 : extraStyles2}
			{iconName}
			{...iconProps}
			alone={!children}
		>
			{@render children?.()}
		</IconText>
	{:else}
		{@render children?.()}
	{/if}
{/snippet}

{#snippet buttonElement()}
	 {#if href}
		<a
			class={cx(buttonClass, incomingClass)}
			class:clearBackground
			class:dimBackground
			class:hoverButton={loadingButton}
			class:icon-only={iconName && !children}
			class:loadingButton
			class:visibilityHidden
			href={isInternalLink ? resolve(localizeHref(href), {}) : href}
			role="button"
			{...isInternalLink ? {} : newTabProps}
			{...restProps}
		>
			{@render content()}
		</a>
	{:else}
		<button
			class={cx(buttonClass, incomingClass)}
			class:clearBackground
			class:dimBackground
			class:hoverButton={loadingButton}
			class:icon-only={iconName && !children}
			class:loadingButton
			class:visibilityHidden
			type="button"
			{...restProps}
		>
			{@render content()}
		</button>
	{/if}
{/snippet}


{#if notTransparent}
<span class:notTransparent>
	{@render buttonElement()}
</span>
	 
{:else}
{@render buttonElement()}
{/if}


<style>
.notTransparent {
	display: inline-block;
	background-color: var(--background);
}

.loadingButton {
	cursor: not-allowed !important;
}

.icon-only {
	padding-inline: var(--space-em-cqi-xs-s);
}

.btn-outline {
	border-color: currentcolor;
	border-width: var(--border-size-1);
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

.clearBackground {
	background-color: var(--background);
}
</style>
