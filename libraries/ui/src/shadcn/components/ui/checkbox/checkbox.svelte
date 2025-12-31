<script lang="ts">
import { Checkbox as CheckboxPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	checked = $bindable(false),
	indeterminate = $bindable(false),
	class: className,
	...restProps
}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props()
</script>

<CheckboxPrimitive.Root
	class={cn(
		`border-input dark:bg-input/30 data-[state=checked]:bg-primary
		data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary
		data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50
		aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
		aria-invalid:border-destructive shadow-xs peer flex size-4 shrink-0 items-center justify-center
		border outline-none transition-shadow focus-visible:ring-[3px]
		disabled:cursor-not-allowed disabled:opacity-50`,
		className,
	)}
	data-slot="checkbox"
	bind:ref
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div class="text-current transition-none" data-slot="checkbox-indicator">
			{#if checked}
				<iconify-icon height="14" icon="lucide:check" width="14"></iconify-icon>
			{:else if indeterminate}
				<iconify-icon height="14" icon="lucide:minus" width="14"></iconify-icon>
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
