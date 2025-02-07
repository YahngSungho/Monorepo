<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: ContextMenuPrimitive.SeparatorProps = $props()
</script>

<ContextMenuPrimitive.Separator
	bind:ref
	class={cn('bg-border -mx-1 my-1 h-px', className)}
	{...restProps}
/>
