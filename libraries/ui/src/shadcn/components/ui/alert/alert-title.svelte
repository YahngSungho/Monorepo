<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	level = 5,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	level?: 1 | 2 | 3 | 4 | 5 | 6
} = $props()
</script>

<div
	bind:this={ref}
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	aria-level={level}
	role="heading"
	{...restProps}
>
	{@render children?.()}
</div>
