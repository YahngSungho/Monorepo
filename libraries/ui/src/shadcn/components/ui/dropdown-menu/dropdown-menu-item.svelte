<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: DropdownMenuPrimitive.ItemProps & {
	inset?: boolean
} = $props()
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground outline-hidden
		data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none
		items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors [&_svg]:pointer-events-none
		[&_svg]:size-4 [&_svg]:shrink-0`,
		inset && 'pl-8',
		className,
	)}
	bind:ref
	{...restProps}
/>
