<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	portalProps,
	ref = $bindable(),
	...restProps
}: ContextMenuPrimitive.ContentProps & {
	portalProps?: ContextMenuPrimitive.PortalProps
} = $props()
</script>

<ContextMenuPrimitive.Portal {...portalProps}>
	<ContextMenuPrimitive.Content
		class={cn(
			`bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-[8rem] rounded-md border p-1
			shadow-md`,
			className,
		)}
		bind:ref
		{...restProps}
	/>
</ContextMenuPrimitive.Portal>
