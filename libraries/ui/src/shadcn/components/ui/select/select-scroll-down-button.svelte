<script lang="ts">


import { Select as SelectPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props()
</script>

<SelectPrimitive.ScrollDownButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	data-slot="select-scroll-down-button"
	bind:ref
	{...restProps}
>
	<iconify-icon icon="lucide:chevron-down"></iconify-icon>
</SelectPrimitive.ScrollDownButton>
