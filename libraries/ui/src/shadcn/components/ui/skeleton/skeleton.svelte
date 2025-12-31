<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef, type WithoutChildren } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('bg-accent animate-pulse', className)}
	data-slot="skeleton"
	{...restProps}
></div>
