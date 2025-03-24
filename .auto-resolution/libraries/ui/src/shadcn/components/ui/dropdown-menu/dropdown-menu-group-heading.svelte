<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: DropdownMenuPrimitive.GroupHeadingProps & {
	inset?: boolean
} = $props()
</script>

<DropdownMenuPrimitive.GroupHeading
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	bind:ref
	{...restProps}
/>
