<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	value = $bindable(''),
	class: className,
	...restProps
}: CommandPrimitive.RootProps = $props()
</script>

<CommandPrimitive.Root
	class={cn(
		'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
		className,
	)}
	data-slot="command"
	bind:value
	bind:ref
	{...restProps}
/>
