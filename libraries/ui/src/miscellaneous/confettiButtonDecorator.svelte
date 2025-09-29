<script module>
import { tick } from 'svelte'
import { Confetti } from 'svelte-confetti'
</script>

<script>
let { children, isConfettiActivated = false, ...properties } = $props()

let clicked = $state(false)
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	style:position="relative"
	style:z-index="1"
	onclick={async () => {
		clicked = false
		await tick()
		clicked = true
	}}
>
	{#if isConfettiActivated && clicked}
		<span
			style:position="absolute"
			style:inset-block-start="50%"
			style:inset-inline-start="50%"
			style:z-index="100"
		>
			<Confetti {...properties} />
		</span>
	{/if}

	<span style:position="relative" style:z-index="1">
		{@render children()}
	</span>
</span>
