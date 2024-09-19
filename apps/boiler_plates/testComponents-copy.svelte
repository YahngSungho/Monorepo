<script>
import TestComponents from './testComponents.svelte'

export let title = ''
export let description = ''
</script>

<div class='background-color'>
	<TestComponents />
	<h1>{title}</h1>
	<h2>{title}</h2>
	<h3>{title}</h3>
	<h4>{title}</h4>
	<h5>{title}</h5>
	<h6>{title}</h6>
	<p>Visit <a href='https://kit.svelte.dev'>kit.svelte.dev</a> to read the documentation</p>
	<p>{description}</p>
</div>

<style>
	.background-color {
		max-inline-size: 100%;
		max-block-size: var(--size-14);
		background-color: var(--indigo-6);
	}
</style>
