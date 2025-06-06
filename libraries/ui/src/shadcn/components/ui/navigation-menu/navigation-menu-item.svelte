<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: NavigationMenuPrimitive.ItemProps = $props()
</script>

<NavigationMenuPrimitive.Item
	class={cn('relative', className)}
	data-slot="navigation-menu-item"
	bind:ref
	{...restProps}
/>
