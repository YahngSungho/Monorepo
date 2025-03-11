<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: DropdownMenuPrimitive.SubContentProps = $props()
</script>

<DropdownMenuPrimitive.SubContent
	class={cn(
		`bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-[8rem] rounded-md border p-1
		shadow-lg`,
		className,
	)}
	bind:ref
	{...restProps}
/>
