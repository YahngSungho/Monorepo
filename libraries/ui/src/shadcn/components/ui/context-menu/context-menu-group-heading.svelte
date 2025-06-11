<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	inset,
	...restProps
}: ContextMenuPrimitive.GroupHeadingProps & {
	inset?: boolean
} = $props()
</script>

<ContextMenuPrimitive.GroupHeading
	class={cn('text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
	data-inset={inset}
	data-slot="context-menu-group-heading"
	bind:ref
	{...restProps}
/>
