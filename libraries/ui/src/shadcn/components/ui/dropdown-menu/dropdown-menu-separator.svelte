<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: DropdownMenuPrimitive.SeparatorProps = $props()
</script>

<DropdownMenuPrimitive.Separator
	class={cn('bg-border -mx-1 my-1 h-px', className)}
	data-slot="dropdown-menu-separator"
	bind:ref
	{...restProps}
/>
