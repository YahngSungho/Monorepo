<script lang="ts">
import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	align = 'center',
	class: className,
	portalProps,
	ref = $bindable(),
	sideOffset = 4,
	...restProps
}: HoverCardPrimitive.ContentProps & {
	portalProps?: HoverCardPrimitive.PortalProps
} = $props()
</script>

<HoverCardPrimitive.Portal {...portalProps}>
	<HoverCardPrimitive.Content
		class={cn(
			'bg-popover text-popover-foreground outline-hidden z-50 mt-3 w-64 rounded-md border p-4 shadow-md',
			className,
		)}
		{align}
		{sideOffset}
		bind:ref
		{...restProps}
	/>
</HoverCardPrimitive.Portal>
