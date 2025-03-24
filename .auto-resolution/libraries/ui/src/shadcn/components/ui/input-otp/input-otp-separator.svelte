<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import Dot from 'lucide-svelte/icons/dot'
import type { HTMLAttributes } from 'svelte/elements'

let {
	children,
	ref = $bindable(),
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
