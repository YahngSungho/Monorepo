<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	inset,
	variant = 'default',
	...restProps
}: DropdownMenuPrimitive.ItemProps & {
	inset?: boolean
	variant?: 'default' | 'destructive'
} = $props()
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground
		data-[variant=destructive]:text-destructive
		data-[variant=destructive]:data-highlighted:bg-destructive/10
		dark:data-[variant=destructive]:data-highlighted:bg-destructive/20
		data-[variant=destructive]:data-highlighted:text-destructive
		data-[variant=destructive]:*:[svg]:!text-destructive
		[&_svg:not([class*='text-'])]:text-muted-foreground outline-hidden relative flex cursor-default
		select-none items-center gap-2 px-2 py-1.5 text-sm data-[disabled]:pointer-events-none
		data-[inset]:pl-8 data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4
		[&_svg]:pointer-events-none [&_svg]:shrink-0`,
		className,
	)}
	data-inset={inset}
	data-slot="dropdown-menu-item"
	data-variant={variant}
	bind:ref
	{...restProps}
/>
