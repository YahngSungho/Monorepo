<script lang="ts">
import { Popover as PopoverPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	align = 'center',
	class: className,
	portalProps,
	ref = $bindable(),
	sideOffset = 4,
	...restProps
}: PopoverPrimitive.ContentProps & {
	portalProps?: PopoverPrimitive.PortalProps
} = $props()
</script>

<PopoverPrimitive.Portal {...portalProps}>
	<PopoverPrimitive.Content
		class={cn(
			`bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out
			data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
			data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
			data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
			data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 w-72 rounded-md border p-4 shadow-md`,
			className,
		)}
		{align}
		{sideOffset}
		bind:ref
		{...restProps}
	/>
</PopoverPrimitive.Portal>
