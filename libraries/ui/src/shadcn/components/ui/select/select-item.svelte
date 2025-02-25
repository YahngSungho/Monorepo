<script lang="ts">
import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui'
import Check from 'lucide-svelte/icons/check'

import { cn } from '$shadcn/utils.js'

let {
	children: childrenProp,
	class: className,
	label,
	ref = $bindable(),
	value,
	...restProps
}: WithoutChild<SelectPrimitive.ItemProps> = $props()
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	class={cn(
		`data-highlighted:bg-accent data-highlighted:text-accent-foreground outline-hidden
		data-disabled:pointer-events-none data-disabled:opacity-50 relative flex w-full cursor-default
		select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm`,
		className,
	)}
	{...restProps}
>
	{#snippet children({ highlighted, selected })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if selected}
				<Check class="size-4" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp({ highlighted, selected })}
		{:else}
			{label || value}
		{/if}
	{/snippet}
</SelectPrimitive.Item>
