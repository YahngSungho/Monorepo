<script lang="ts">
import { Menubar as MenubarPrimitive, type WithoutChild } from 'bits-ui'
import ChevronRight from 'lucide-svelte/icons/chevron-right'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	inset,
	ref = $bindable(),
	...restProps
}: WithoutChild<MenubarPrimitive.SubTriggerProps> & {
	inset?: boolean
} = $props()
</script>

<MenubarPrimitive.SubTrigger
	class={cn(
		`data-highlighted:bg-accent data-[state=open]:bg-accent data-highlighted:text-accent-foreground
		data-[state=open]:text-accent-foreground outline-hidden data-disabled:pointer-events-none
		data-disabled:opacity-50 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm`,
		inset && 'pl-8',
		className,
	)}
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ChevronRight class="ml-auto size-4" />
</MenubarPrimitive.SubTrigger>
