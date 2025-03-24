<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('w-full text-sm', className)}
	data-sidebar="group-content"
	{...restProps}
>
	{@render children?.()}
</div>
