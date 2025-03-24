<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props()
</script>

<ul
	bind:this={ref}
	class={cn(
		'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
		'group-data-[collapsible=icon]:hidden',
		className,
	)}
	data-sidebar="menu-sub"
	{...restProps}
>
	{@render children?.()}
</ul>
