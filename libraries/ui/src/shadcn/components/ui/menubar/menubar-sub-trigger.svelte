<script lang="ts">
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn, type WithoutChild } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	inset = undefined,
	children,
	...restProps
}: WithoutChild<MenubarPrimitive.SubTriggerProps> & {
	inset?: boolean
} = $props()
</script>

<MenubarPrimitive.SubTrigger
	class={cn(
		`focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent
		data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm
		px-2 py-1.5 text-sm outline-none data-[inset]:pl-8`,
		className,
	)}
	data-inset={inset}
	data-slot="menubar-sub-trigger"
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="ml-auto size-4" />
</MenubarPrimitive.SubTrigger>
