<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: MenubarPrimitive.TriggerProps = $props()
</script>

<MenubarPrimitive.Trigger
	class={cn(
		`focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent
		data-[state=open]:text-accent-foreground outline-hidden flex select-none items-center rounded-sm
		px-2 py-1 text-sm font-medium`,
		className,
	)}
	data-slot="menubar-trigger"
	bind:ref
	{...restProps}
/>
