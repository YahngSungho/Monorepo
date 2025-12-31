<script lang="ts">


import { Menubar as MenubarPrimitive } from 'bits-ui'

import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children: childrenProp,
	...restProps
}: WithoutChild<MenubarPrimitive.RadioItemProps> = $props()
</script>

<MenubarPrimitive.RadioItem
	class={cn(
		`focus:bg-accent focus:text-accent-foreground outline-hidden relative flex cursor-default
	select-none items-center gap-2 py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none
		data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none
		[&_svg]:shrink-0`,
		className,
	)}
	data-slot="menubar-radio-item"
	bind:ref
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
			{#if checked}
				<iconify-icon icon="lucide:circle"></iconify-icon>
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</MenubarPrimitive.RadioItem>
