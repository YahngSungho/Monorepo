<script lang="ts">
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: MenubarPrimitive.GroupHeadingProps & {
	inset?: boolean
} = $props()
</script>

<MenubarPrimitive.GroupHeading
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	bind:ref
	{...restProps}
/>
