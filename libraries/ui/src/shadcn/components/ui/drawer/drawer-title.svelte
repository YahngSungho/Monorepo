<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: DrawerPrimitive.TitleProps = $props()
</script>

<DrawerPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	bind:ref
	{...restProps}
/>
