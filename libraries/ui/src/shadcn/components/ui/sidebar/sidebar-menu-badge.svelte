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
		`text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 select-none
		items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums`,
		`peer-hover/menu-button:text-sidebar-accent-foreground
		peer-data-[active=true]/menu-button:text-sidebar-accent-foreground`,
		'peer-data-[size=sm]/menu-button:top-1',
		'peer-data-[size=default]/menu-button:top-1.5',
		'peer-data-[size=lg]/menu-button:top-2.5',
		'group-data-[collapsible=icon]:hidden',
		className,
	)}
	data-sidebar="menu-badge"
	data-slot="sidebar-menu-badge"
	{...restProps}
>
	{@render children?.()}
</div>
