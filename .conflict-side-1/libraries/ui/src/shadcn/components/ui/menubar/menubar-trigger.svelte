<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: MenubarPrimitive.TriggerProps = $props()
</script>

<MenubarPrimitive.Trigger
	class={cn(
		`data-highlighted:bg-accent data-[state=open]:bg-accent data-highlighted:text-accent-foreground
		data-[state=open]:text-accent-foreground outline-hidden flex cursor-default select-none items-center
		rounded-sm px-3 py-1.5 text-sm font-medium`,
		className,
	)}
	bind:ref
	{...restProps}
/>
