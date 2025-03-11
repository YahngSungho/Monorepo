<script lang="ts">
import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
import ChevronUp from 'lucide-svelte/icons/chevron-up'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props()
</script>

<SelectPrimitive.ScrollUpButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	bind:ref
	{...restProps}
>
	<ChevronUp class="size-4" />
</SelectPrimitive.ScrollUpButton>
