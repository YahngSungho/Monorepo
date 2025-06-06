<script lang="ts">
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn, type WithoutChild } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	inset,
	children,
	...restProps
}: WithoutChild<ContextMenuPrimitive.SubTriggerProps> & {
	inset?: boolean
} = $props()
</script>

<ContextMenuPrimitive.SubTrigger
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=open]:bg-accent
		data-[state=open]:text-accent-foreground outline-hidden
		[&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default select-none items-center
		gap-2 rounded-sm px-2 py-1.5 text-sm data-[disabled]:pointer-events-none data-[inset]:pl-8
		data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none
		[&_svg]:shrink-0`,
		className,
	)}
	data-inset={inset}
	data-slot="context-menu-sub-trigger"
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="ml-auto" />
</ContextMenuPrimitive.SubTrigger>
