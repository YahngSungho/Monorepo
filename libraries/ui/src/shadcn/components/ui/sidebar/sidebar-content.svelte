<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
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
	data-slot="sidebar-content"
	{...restProps}
>
	{@render children?.()}
</div>
