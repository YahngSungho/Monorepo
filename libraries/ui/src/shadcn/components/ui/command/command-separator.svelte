<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: CommandPrimitive.SeparatorProps = $props()
</script>

<CommandPrimitive.Separator class={cn('bg-border -mx-1 h-px', className)} bind:ref {...restProps} />
