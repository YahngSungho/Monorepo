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
	bind:ref
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronUp class="size-4" />
</SelectPrimitive.ScrollUpButton>
