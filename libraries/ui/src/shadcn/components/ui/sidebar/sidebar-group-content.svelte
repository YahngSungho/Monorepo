<script lang="ts">
import { cn } from '$shadcn/utils.js'
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	bind:this={ref}
	data-sidebar="group-content"
	class={cn('w-full text-sm', className)}
	{...restProps}
>
	{@render children?.()}
</div>
