<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: MenubarPrimitive.RootProps = $props()
</script>

<MenubarPrimitive.Root
	class={cn('bg-background flex h-10 items-center space-x-1 rounded-md border p-1', className)}
	bind:ref
	{...restProps}
/>
