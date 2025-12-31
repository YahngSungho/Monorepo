<script lang="ts">


import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'
import type { Snippet } from 'svelte'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	checked = $bindable(false),
	indeterminate = $bindable(false),
	class: className,
	children: childrenProp,
	...restProps
}: WithoutChildrenOrChild<ContextMenuPrimitive.CheckboxItemProps> & {
	children?: Snippet
} = $props()
</script>

<ContextMenuPrimitive.CheckboxItem
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground outline-hidden relative flex
		cursor-default select-none items-center gap-2 py-1.5 pl-8 pr-2 text-sm
		data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4
		[&_svg]:pointer-events-none [&_svg]:shrink-0`,
		className,
	)}
	data-slot="context-menu-checkbox-item"
	bind:ref
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
			{#if checked}
				<iconify-icon icon="lucide:check"></iconify-icon>
			{/if}
		</span>
		{@render childrenProp?.()}
	{/snippet}
</ContextMenuPrimitive.CheckboxItem>
