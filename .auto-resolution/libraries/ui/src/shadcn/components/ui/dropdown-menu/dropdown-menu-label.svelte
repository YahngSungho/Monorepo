<script lang="ts">
import { type WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	inset?: boolean
} = $props()
</script>

<div
	bind:this={ref}
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	{...restProps}
>
	{@render children?.()}
</div>
