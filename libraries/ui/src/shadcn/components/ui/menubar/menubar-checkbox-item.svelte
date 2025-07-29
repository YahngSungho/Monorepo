<script lang="ts">


import { Menubar as MenubarPrimitive } from 'bits-ui'
import type { Snippet } from 'svelte'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	checked = $bindable(false),
	indeterminate = $bindable(false),
	children: childrenProp,
	...restProps
}: WithoutChildrenOrChild<MenubarPrimitive.CheckboxItemProps> & {
	children?: Snippet
} = $props()
</script>

<MenubarPrimitive.CheckboxItem
	class={cn(
		`focus:bg-accent focus:text-accent-foreground rounded-xs outline-hidden relative flex cursor-default
		select-none items-center gap-2 py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none
		data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none
		[&_svg]:shrink-0`,
		className,
	)}
	data-slot="menubar-checkbox-item"
	bind:ref
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
			{#if indeterminate}
				<iconify-icon height="16" icon="lucide:minus" width="16"></iconify-icon>
			{:else if checked}
				<iconify-icon height="16" icon="lucide:check" width="16"></iconify-icon>
			{/if}
		</span>
		{@render childrenProp?.()}
	{/snippet}
</MenubarPrimitive.CheckboxItem>
