<script lang="ts">
import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'

import { type ToggleVariants, toggleVariants } from '$shadcn/components/ui/toggle/index.js'
import { cn } from '$shadcn/utils'

import { getToggleGroupCtx } from './toggle-group.svelte'

let {
	ref = $bindable(null),
	value = $bindable(),
	class: className,
	size,
	variant,
	...restProps
}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props()

const ctx = getToggleGroupCtx()
</script>

<ToggleGroupPrimitive.Item
	class={cn(
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size,
		}),
		`min-w-0 flex-1 shrink-0 shadow-none focus:z-10
		focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l`,
		className,
	)}
	data-size={ctx.size || size}
	data-slot="toggle-group-item"
	data-variant={ctx.variant || variant}
	{value}
	bind:ref
	{...restProps}
/>
