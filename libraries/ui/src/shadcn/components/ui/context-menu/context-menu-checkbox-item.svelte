<script lang="ts">
import { ContextMenu as ContextMenuPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
import Check from 'lucide-svelte/icons/check'
import Minus from 'lucide-svelte/icons/minus'
import type { Snippet } from 'svelte'

import { cn } from '$shadcn/utils.js'

let {
	checked = $bindable(false),
	children: childrenProp,
	class: className,
	indeterminate = $bindable(false),
	ref = $bindable(),
	...restProps
}: WithoutChildrenOrChild<ContextMenuPrimitive.CheckboxItemProps> & {
	children?: Snippet
} = $props()
</script>

<ContextMenuPrimitive.CheckboxItem
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground outline-hidden
		data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none
		items-center rounded-sm py-1.5 pl-8 pr-2 text-sm`,
		className,
	)}
	bind:ref
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if indeterminate}
				<Minus class="size-3.5" />
			{:else}
				<Check class={cn('size-3.5', !checked && 'text-transparent')} />
			{/if}
		</span>
		{@render childrenProp?.()}
	{/snippet}
</ContextMenuPrimitive.CheckboxItem>
