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
 * 	| 'text'} variant
 * @property {string} [href]
 */
let { children = undefined, href = undefined, variant = 'primary', class: incomingClass = '', ...restProps } = $props()

const buttonClass = `btn btn-${variant}`
</script>

{#if href}
	<a class={cx(buttonClass, incomingClass)} {href} role="button" type="button" {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button class={cx(buttonClass, incomingClass)}  type="button" {...restProps}>
		{@render children?.()}
	</button>
{/if}

<span style:display="none" class="
btn-neutral
	 btn-primary
	 btn-secondary
	 btn-accent
	 btn-info
	 btn-success
	 btn-warning
	 btn-error
	 btn-ghost
	 ">
	</span>



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
