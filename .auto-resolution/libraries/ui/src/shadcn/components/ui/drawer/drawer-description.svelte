<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: DrawerPrimitive.DescriptionProps = $props()
</script>

<DrawerPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	bind:ref
	{...restProps}
/>
