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
	class={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
	{...restProps}
>
	{@render children?.()}
</div>
