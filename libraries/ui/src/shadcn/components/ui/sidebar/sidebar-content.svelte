<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn(
		'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
		className,
	)}
	data-sidebar="content"
	{...restProps}
>
	{@render children?.()}
</div>
