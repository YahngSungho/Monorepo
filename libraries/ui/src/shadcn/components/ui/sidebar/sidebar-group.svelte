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
	class={cn('relative flex w-full min-w-0 flex-col p-2', className)}
	data-sidebar="group"
	data-slot="sidebar-group"
	{...restProps}
>
	{@render children?.()}
</div>
