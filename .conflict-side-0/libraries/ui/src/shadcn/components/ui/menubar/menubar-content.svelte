<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	align = 'start',
	alignOffset = -4,
	class: className,
	portalProps,
	ref = $bindable(),
	side = 'bottom',
	sideOffset = 8,
	...restProps
}: MenubarPrimitive.ContentProps & {
	portalProps?: MenubarPrimitive.PortalProps
} = $props()
</script>

<MenubarPrimitive.Portal {...portalProps}>
	<MenubarPrimitive.Content
		class={cn(
			`bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-[12rem] rounded-md border p-1
			shadow-md`,
			className,
		)}
		{align}
		{alignOffset}
		{side}
		{sideOffset}
		bind:ref
		{...restProps}
	/>
</MenubarPrimitive.Portal>
