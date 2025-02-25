<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: ContextMenuPrimitive.SubContentProps = $props()
</script>

<ContextMenuPrimitive.SubContent
	bind:ref
	class={cn(
		`bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-[8rem] overflow-hidden rounded-md
		border p-1 shadow-md`,
		className,
	)}
	{...restProps}
/>
