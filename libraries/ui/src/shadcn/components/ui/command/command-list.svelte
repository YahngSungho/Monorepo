<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: CommandPrimitive.ListProps = $props()
</script>

<CommandPrimitive.List
	class={cn('max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden', className)}
	data-slot="command-list"
	bind:ref
	{...restProps}
/>
