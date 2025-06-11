<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: MenubarPrimitive.RootProps = $props()
</script>

<MenubarPrimitive.Root
	class={cn('bg-background shadow-xs flex h-9 items-center gap-1 rounded-md border p-1', className)}
	data-slot="menubar"
	bind:ref
	{...restProps}
/>
