<script lang="ts">
import { ScrollArea as ScrollAreaPrimitive, type WithoutChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

import { Scrollbar } from './index.js'

let {
	children,
	class: className,
	orientation = 'vertical',
	ref = $bindable(),
	scrollbarXClasses = '',
	scrollbarYClasses = '',
	...restProps
}: WithoutChild<ScrollAreaPrimitive.RootProps> & {
	orientation?: 'both' | 'horizontal' | 'vertical' | undefined
	scrollbarXClasses?: string | undefined
	scrollbarYClasses?: string | undefined
} = $props()
</script>

<ScrollAreaPrimitive.Root bind:ref {...restProps} class={cn('relative overflow-hidden', className)}>
	<ScrollAreaPrimitive.Viewport class="h-full w-full rounded-[inherit]">
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>
	{#if orientation === 'vertical' || orientation === 'both'}
		<Scrollbar class={scrollbarYClasses} orientation="vertical" />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<Scrollbar class={scrollbarXClasses} orientation="horizontal" />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
