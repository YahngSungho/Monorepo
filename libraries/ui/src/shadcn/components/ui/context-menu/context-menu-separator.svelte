<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: ContextMenuPrimitive.SeparatorProps = $props()
</script>

<ContextMenuPrimitive.Separator
	class={cn('bg-border -mx-1 my-1 h-px', className)}
	data-slot="context-menu-separator"
	bind:ref
	{...restProps}
/>
