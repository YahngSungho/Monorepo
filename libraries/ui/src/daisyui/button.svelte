<script>
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
let { children, href, variant = 'primary', ...restProps } = $props()

;('') // eslint-disable-line
</script>

{#if href}
	<a {href} class={`button-type btn btn-${variant}`} type="button" role="button" {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button class={`button-type btn btn-${variant}`} type="button" {...restProps}>
		{@render children?.()}
	</button>
{/if}

<style>
.button-type {
	font-size: var(--font-size-2);
	font-weight: var(--font-weight-5);
}

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
