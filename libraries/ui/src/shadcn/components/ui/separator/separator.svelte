<script lang="ts">
import { Separator as SeparatorPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	orientation = 'horizontal',
	ref = $bindable(),
	...restProps
}: SeparatorPrimitive.RootProps = $props()
</script>

<SeparatorPrimitive.Root
	class={cn(
		'bg-border shrink-0',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'min-h-full w-[1px]',
		className,
	)}
	{orientation}
	bind:ref
	{...restProps}
/>
