<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
	bind:this={ref}
	class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
	{...restProps}
>
	{@render children?.()}
</span>
