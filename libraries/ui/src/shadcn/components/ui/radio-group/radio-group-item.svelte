<script lang="ts">
import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
import Circle from 'lucide-svelte/icons/circle'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props()
</script>

<RadioGroupPrimitive.Item
	class={cn(
		`border-primary text-primary ring-offset-background focus-visible:ring-ring focus:outline-hidden
		aspect-square size-4 rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2
		disabled:cursor-not-allowed disabled:opacity-50`,
		className,
	)}
	bind:ref
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="flex items-center justify-center">
			{#if checked}
				<Circle class="size-2.5 fill-current text-current" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
