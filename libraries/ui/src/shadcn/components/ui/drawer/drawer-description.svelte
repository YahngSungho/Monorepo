<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: DrawerPrimitive.DescriptionProps = $props()
</script>

<DrawerPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	data-slot="drawer-description"
	bind:ref
	{...restProps}
/>
