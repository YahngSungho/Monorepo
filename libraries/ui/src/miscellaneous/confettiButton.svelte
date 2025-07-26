<script module>
import { tick } from 'svelte'
import { Confetti } from 'svelte-confetti'
</script>

<script>
let { children, isConfettiActivated = false, ...props } = $props()

let clicked = $state(false)
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	style="position: relative; z-index: 1;"
	onclick={async () => {
		clicked = false
		await tick()
		clicked = true
	}}
>
	{@render children()}

	{#if isConfettiActivated && clicked}
		<div style="position: absolute; z-index: 1; inset-block-start: 50%; inset-inline-start: 50%;">
			<Confetti {...props} />
		</div>
	{/if}
</span>
