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
	class={cn(
		'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
		className,
	)}
	data-slot="card"
	{...restProps}
>
	{@render children?.()}
</div>
