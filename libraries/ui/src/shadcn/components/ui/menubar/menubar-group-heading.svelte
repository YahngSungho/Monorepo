<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'
import type { ComponentProps } from 'svelte'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	inset,
	class: className,
	...restProps
}: ComponentProps<typeof MenubarPrimitive.GroupHeading> & {
	inset?: boolean
} = $props()
</script>

<MenubarPrimitive.GroupHeading
	class={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
	data-inset={inset}
	data-slot="menubar-group-heading"
	bind:ref
	{...restProps}
/>
