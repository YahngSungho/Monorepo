<script lang="ts">
import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
import ChevronDown from 'lucide-svelte/icons/chevron-down'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props()
</script>

<SelectPrimitive.ScrollDownButton
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	bind:ref
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>
