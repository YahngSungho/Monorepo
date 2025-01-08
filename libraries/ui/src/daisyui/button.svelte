<script>

/**
 * @typedef {('primary'|'secondary'|'accent'|'info'|'success'|'warning'|'error'|'outline'|'text')} variant
 */
let { children, variant, ...restProps } = $props()

''; // eslint-disable-line no-unused-expressions, sonarjs/no-unused-expressions, semi
</script>

<button class={`btn btn-${variant}`}
	type='button'
	{...restProps}
>
	{@render children?.()}
</button>

<style>
button {
	font-size: var(--font-size-2);
	font-weight: var(--font-weight-5);
}

.btn-outline {
	border-width: 1px;
	background-color: transparent;
}

.btn-text {
	border: none;
	background-color: transparent;
}
</style>
