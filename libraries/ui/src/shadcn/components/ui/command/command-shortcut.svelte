<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
	bind:this={ref}
	class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
	data-slot="command-shortcut"
	{...restProps}
>
	{@render children?.()}
</span>
