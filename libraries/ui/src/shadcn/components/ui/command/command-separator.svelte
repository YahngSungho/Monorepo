<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CommandPrimitive.SeparatorProps = $props()
</script>

<CommandPrimitive.Separator
	class={cn('bg-border -mx-1 h-px', className)}
	data-slot="command-separator"
	bind:ref
	{...restProps}
/>
