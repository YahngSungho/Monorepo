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
	class={cn('flex flex-col gap-2 p-2', className)}
	data-sidebar="header"
	data-slot="sidebar-header"
	{...restProps}
>
	{@render children?.()}
</div>
