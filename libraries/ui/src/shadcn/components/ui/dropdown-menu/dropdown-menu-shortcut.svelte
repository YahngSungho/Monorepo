<script lang="ts">
import { type WithElementRef } from 'bits-ui'
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
	class={cn('ml-auto text-xs tracking-widest opacity-60', className)}
	{...restProps}
>
	{@render children?.()}
</span>
