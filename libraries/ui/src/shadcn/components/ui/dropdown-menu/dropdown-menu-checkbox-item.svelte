<script lang="ts">
import 'iconify-icon'

import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import type { Snippet } from 'svelte'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	checked = $bindable(false),
	indeterminate = $bindable(false),
	class: className,
	children: childrenProp,
	...restProps
}: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
	children?: Snippet
} = $props()
</script>

<DropdownMenuPrimitive.CheckboxItem
	class={cn(
		`focus:bg-accent focus:text-accent-foreground outline-hidden relative flex cursor-default select-none
		items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none
		data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none
		[&_svg]:shrink-0`,
		className,
	)}
	data-slot="dropdown-menu-checkbox-item"
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
</DropdownMenuPrimitive.CheckboxItem>
