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

<div bind:this={ref} class={cn('mt-auto flex flex-col gap-2 p-4', className)} {...restProps}>
	{@render children?.()}
</div>
