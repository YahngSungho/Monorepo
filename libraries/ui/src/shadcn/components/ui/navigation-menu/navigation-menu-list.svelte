<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: NavigationMenuPrimitive.ListProps = $props()
</script>

<NavigationMenuPrimitive.List
	class={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
	data-slot="navigation-menu-list"
	bind:ref
	{...restProps}
/>
