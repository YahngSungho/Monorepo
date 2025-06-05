<script>
import { cx } from '@emotion/css'

/**
 * @typedef {'primary'
 * 	| 'secondary'
 * 	| 'accent'
 * 	| 'info'
 * 	| 'success'
 * 	| 'warning'
 * 	| 'error'
 * 	| 'outline'
 * 	| 'ghost'
 * 	| 'text'} variant
 * @property {string} [href]
 */
let {
	children = undefined,
	href = undefined,
	variant = 'primary',
	class: incomingClass = '',
	...restProps
} = $props()

const buttonClass = `btn btn-${variant}`

// Todo: 현재 주소랑 href로 받은 주소비교해서 internal이면 locale 유지되게 하는거 - 이거 localizeHref를 prop으로 안받고 내부로만 해도 작동됨?
</script>

{#if href}
	<a class={cx(buttonClass, incomingClass)} {href} role="button" type="button" {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button class={cx(buttonClass, incomingClass)} type="button" {...restProps}>
		{@render children?.()}
	</button>
{/if}

<style>
.btn-outline {
	border-width: var(--border-size-2);
	background-color: transparent;
}

.btn-text {
	border: none;
	background-color: transparent;
	box-shadow: none;
}
</style>
