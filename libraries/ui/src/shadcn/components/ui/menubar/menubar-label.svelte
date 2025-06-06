<script lang="ts">
import { type WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	inset,
	children,
	class: className,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> & {
	inset?: boolean
} = $props()
</script>

<div
	bind:this={ref}
	class={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
	data-inset={inset}
	data-slot="menubar-label"
	{...restProps}
>
	{@render children?.()}
</div>
