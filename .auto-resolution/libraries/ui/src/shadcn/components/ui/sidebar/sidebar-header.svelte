<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('flex flex-col gap-2 p-2', className)}
	data-sidebar="header"
	{...restProps}
>
	{@render children?.()}
</div>
