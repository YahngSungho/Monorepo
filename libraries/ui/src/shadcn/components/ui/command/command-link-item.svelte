<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: CommandPrimitive.LinkItemProps = $props()
</script>

<CommandPrimitive.LinkItem
	class={cn(
		`aria-selected:bg-accent aria-selected:text-accent-foreground outline-hidden
		data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none
		items-center rounded-sm px-2 py-1.5 text-sm`,
		className,
	)}
	bind:ref
	{...restProps}
/>
