<script module>
import { css, cx } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'
import IconText from '@library/ui/icon-text'

const newTabProperties = {
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
	children,
	class: incomingClass = '',
	clearBackground = false,
	dimBackground = false,
	href,
	iconName = '',
	iconProps: iconProperties = {},
	loading: loadingButton = false,
	shape = '',
	size = 'md',
	variant = 'primary',
	visibilityHidden = false,
	...restProperties
} = $props()

const buttonShape = shape ? `btn-${shape}` : ''
const buttonClass = `btn btn-${variant} btn-${size} ${buttonShape}`
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
			class={children ? extStyles1 : extraStyles2} {icname}
			{...iconProperties}
			alone={!children}
		>
			{@render children?.()}
		</IconText>
	{:else}
		{@render children?.()}
	{/if}
{/snippet}

{#if href}
	<a
		class={cx(buttonClass, incomingClass)}
		class:clearBackground
		class:dimBackground
		class:hoverButton={loadingButton}
		class:icon-only={iconName && !children}
		class:loadingButton
		class:visibilityHidden
		href={isInternalLink ? localizeHref(href) : href}
		role="button"
		type="button"
		{...isInternalLink ? {} : newTabProperties}
		{...restProperties}
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
		{...restProperties}
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
