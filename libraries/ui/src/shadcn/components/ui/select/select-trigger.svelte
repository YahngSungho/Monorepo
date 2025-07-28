<script lang="ts">
import 'iconify-icon'

import { Select as SelectPrimitive } from 'bits-ui'

import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	size = 'default',
	...restProps
}: WithoutChild<SelectPrimitive.TriggerProps> & {
	size?: 'default' | 'sm'
} = $props()
</script>

<SelectPrimitive.Trigger
	class={cn(
		`border-input data-[placeholder]:text-muted-foreground
		[&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring
		focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
		aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 shadow-xs flex w-fit
		items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-transparent px-3 py-2
		text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px]
		disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8
		*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex
		*:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2
		[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
		className,
	)}
	data-size={size}
	data-slot="select-trigger"
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<iconify-icon style="opacity: 0.5;" height="16" icon="lucide:chevron-down" width="16"></iconify-icon>
</SelectPrimitive.Trigger>
