<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CommandPrimitive.EmptyProps = $props()
</script>

<CommandPrimitive.Empty
	class={cn('py-6 text-center text-sm', className)}
	data-slot="command-empty"
	bind:ref
	{...restProps}
/>
