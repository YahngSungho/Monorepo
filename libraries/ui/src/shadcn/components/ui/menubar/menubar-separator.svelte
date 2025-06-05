<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: MenubarPrimitive.SeparatorProps = $props()
</script>

<MenubarPrimitive.Separator
	class={cn('bg-border -mx-1 my-1 h-px', className)}
	data-slot="menubar-separator"
	bind:ref
	{...restProps}
/>
