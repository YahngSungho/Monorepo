<script lang="ts">
import { Progress as ProgressPrimitive, type WithoutChildrenOrChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	max = 100,
	ref = $bindable(),
	value,
	...restProps
}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props()
</script>

<ProgressPrimitive.Root
	class={cn('bg-secondary relative h-4 w-full overflow-hidden rounded-full', className)}
	{max}
	{value}
	bind:ref
	{...restProps}
>
	<div
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
		class="bg-primary h-full w-full flex-1 transition-all"
	></div>
</ProgressPrimitive.Root>
