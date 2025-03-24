<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: ContextMenuPrimitive.GroupHeadingProps & {
	inset?: boolean
} = $props()
</script>

<ContextMenuPrimitive.GroupHeading
	class={cn('text-foreground px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	bind:ref
	{...restProps}
/>
