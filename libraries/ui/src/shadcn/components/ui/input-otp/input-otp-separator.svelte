<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'
import type { WithElementRef } from 'bits-ui'
import Dot from 'lucide-svelte/icons/dot'

let {
	children,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div bind:this={ref} role="separator" {...restProps}>
	{#if children}
		{@render children?.()}
	{:else}
		<Dot />
	{/if}
</div>
