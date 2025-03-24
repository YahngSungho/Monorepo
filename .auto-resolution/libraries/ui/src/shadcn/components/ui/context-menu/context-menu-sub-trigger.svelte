<script lang="ts">
import { ContextMenu as ContextMenuPrimitive, type WithoutChild } from 'bits-ui'
import ChevronRight from 'lucide-svelte/icons/chevron-right'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: WithoutChild<ContextMenuPrimitive.SubTriggerProps> & {
	inset?: boolean
} = $props()
</script>

<ContextMenuPrimitive.SubTrigger
	class={cn(
		`data-highlighted:bg-accent data-[state=open]:bg-accent data-highlighted:text-accent-foreground
		data-[state=open]:text-accent-foreground outline-hidden flex cursor-default select-none items-center
		rounded-sm px-2 py-1.5 text-sm`,
		inset && 'pl-8',
		className,
	)}
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ChevronRight class="ml-auto size-4" />
</ContextMenuPrimitive.SubTrigger>
