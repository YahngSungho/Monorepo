<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: MenubarPrimitive.SubContentProps = $props()
</script>

<MenubarPrimitive.SubContent
	class={cn(
		'bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-max rounded-md border p-1',
		className,
	)}
	bind:ref
	{...restProps}
/>
