<script lang="ts">
import { ScrollArea as ScrollAreaPrimitive, type WithoutChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	orientation = 'vertical',
	ref = $bindable(),
	...restProps
}: WithoutChild<ScrollAreaPrimitive.ScrollbarProps> = $props()
</script>

<ScrollAreaPrimitive.Scrollbar
	class={cn(
		'flex touch-none select-none transition-colors',
		orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
		orientation === 'horizontal' && 'h-2.5 w-full border-t border-t-transparent p-px',
		className,
	)}
	{orientation}
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ScrollAreaPrimitive.Thumb
		class={cn('bg-border relative rounded-full', orientation === 'vertical' && 'flex-1')}
	/>
</ScrollAreaPrimitive.Scrollbar>
