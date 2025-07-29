<script lang="ts">


import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props()
</script>

<RadioGroupPrimitive.Item
	class={cn(
		`border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50
		aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
		aria-invalid:border-destructive dark:bg-input/30 shadow-xs aspect-square size-4 shrink-0
		rounded-full border outline-none transition-[color,box-shadow] focus-visible:ring-[3px]
		disabled:cursor-not-allowed disabled:opacity-50`,
		className,
	)}
	data-slot="radio-group-item"
	bind:ref
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="relative flex items-center justify-center" data-slot="radio-group-indicator">
			{#if checked}
				<iconify-icon icon="lucide:circle"></iconify-icon>
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
