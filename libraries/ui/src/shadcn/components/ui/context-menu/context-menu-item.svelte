<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	inset,
	ref = $bindable(null),
	...restProps
}: ContextMenuPrimitive.ItemProps & {
	inset?: boolean
} = $props()
</script>

<ContextMenuPrimitive.Item
	bind:ref
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground outline-hidden
		data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none
		items-center rounded-sm px-2 py-1.5 text-sm`,
		inset && 'pl-8',
		className,
	)}
	{...restProps}
/>
