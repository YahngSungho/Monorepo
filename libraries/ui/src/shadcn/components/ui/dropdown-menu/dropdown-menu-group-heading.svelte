<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import type { ComponentProps } from 'svelte'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	inset,
	...restProps
}: ComponentProps<typeof DropdownMenuPrimitive.GroupHeading> & {
	inset?: boolean
} = $props()
</script>

<DropdownMenuPrimitive.GroupHeading
	class={cn('px-2 py-1.5 text-sm font-semibold data-[inset]:pl-8', className)}
	data-inset={inset}
	data-slot="dropdown-menu-group-heading"
	bind:ref
	{...restProps}
/>
