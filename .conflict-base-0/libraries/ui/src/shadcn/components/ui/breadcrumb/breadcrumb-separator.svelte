<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import ChevronRight from 'lucide-svelte/icons/chevron-right'
import type { HTMLLiAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li
	bind:this={ref}
	class={cn('[&>svg]:size-3.5', className)}
	aria-hidden="true"
	role="presentation"
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		<ChevronRight />
	{/if}
</li>
