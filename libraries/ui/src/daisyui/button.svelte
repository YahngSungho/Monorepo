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
	<a class={`btn btn-${variant}`} {href} role="button" type="button" {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button class={`btn btn-${variant}`} type="button" {...restProps}>
		{@render children?.()}
	</button>
{/if}

<span class="btn-neutral
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
