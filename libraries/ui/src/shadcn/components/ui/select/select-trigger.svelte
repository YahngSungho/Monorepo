<script lang="ts">
import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui'
import ChevronDown from 'lucide-svelte/icons/chevron-down'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChild<SelectPrimitive.TriggerProps> = $props()
</script>

<SelectPrimitive.Trigger
	class={cn(
		`border-input bg-background ring-offset-background data-placeholder:text-muted-foreground
		focus:ring-ring focus:outline-hidden flex h-10 w-full items-center justify-between rounded-md border
		px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
		[&>span]:line-clamp-1`,
		className,
	)}
	bind:ref
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
