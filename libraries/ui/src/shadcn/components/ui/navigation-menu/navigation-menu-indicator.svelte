<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: NavigationMenuPrimitive.IndicatorProps = $props()
</script>

<NavigationMenuPrimitive.Indicator
	class={cn(
		`data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out
		data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden`,
		className,
	)}
	data-slot="navigation-menu-indicator"
	bind:ref
	{...restProps}
>
	<div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
</NavigationMenuPrimitive.Indicator>
