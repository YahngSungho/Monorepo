<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { Skeleton } from '$shadcn/components/ui/skeleton/index.js'
import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	showIcon = false,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> & {
	showIcon?: boolean
} = $props()

// Random width between 50% and 90%
const width = `${Math.floor(Math.random() * 40) + 50}%`
</script>

<div
	bind:this={ref}
	class={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
	data-sidebar="menu-skeleton"
	data-slot="sidebar-menu-skeleton"
	{...restProps}
>
	{#if showIcon}
		<Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
	{/if}
	<Skeleton
		style="--skeleton-width: {width};"
		class="max-w-(--skeleton-width) h-4 flex-1"
		data-sidebar="menu-skeleton-text"
	/>
	{@render children?.()}
</div>
