<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: DropdownMenuPrimitive.SeparatorProps = $props()
</script>

<DropdownMenuPrimitive.Separator
	class={cn('bg-muted -mx-1 my-1 h-px', className)}
	bind:ref
	{...restProps}
/>
