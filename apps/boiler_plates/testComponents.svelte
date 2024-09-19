<div class='background-color'>
	<h1>{title}</h1>
	<p>{description}</p>
</div>

<script>
export let title = ''
export let description = ''
</script>

<style>
	.background-color {
		inline-size: var(--size-fluid-1);
		max-inline-size: 100%;
		block-size: var(--size-fluid-1);
		background-color: var(--red-8);
	}
</style>
