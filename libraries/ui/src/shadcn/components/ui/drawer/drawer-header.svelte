<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('flex flex-col gap-1.5 p-4', className)}
	data-slot="drawer-header"
	{...restProps}
>
	{@render children?.()}
</div>
