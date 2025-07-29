<script lang="ts">


import { Select as SelectPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props()
</script>

<SelectPrimitive.ScrollUpButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	data-slot="select-scroll-up-button"
	bind:ref
	{...restProps}
>
	<iconify-icon icon="lucide:chevron-up"></iconify-icon>
</SelectPrimitive.ScrollUpButton>
