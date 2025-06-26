<script module>
import { cx } from '@emotion/css'
import { localizeHref } from '@library/paraglide/helpers'

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
	href = undefined,
	size = 'md',
	shape = '',
	variant = 'primary',
	class: incomingClass = '',
	...restProps
} = $props()

const btnShape = shape ? `btn-${shape}` : ''
const buttonClass = `btn btn-${variant} btn-${size} ${btnShape}`

const isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>

{#if href}
	<a
		class={cx(buttonClass, incomingClass)}
		href={isInternalLink ? localizeHref(href) : href}
		role="button"
		type="button"
		{...isInternalLink ? {} : newTabProps}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button class={cx(buttonClass, incomingClass)} type="button" {...restProps}>
		{@render children?.()}
	</button>
{/if}

<style>
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
</style>
