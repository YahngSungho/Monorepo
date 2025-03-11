<script lang="ts">
import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'

import { type ToggleVariants, toggleVariants } from '$shadcn/components/ui/toggle/index.js'
import { cn } from '$shadcn/utils.js'

import { getToggleGroupCtx } from './toggle-group.svelte'

let {
	class: className,
	ref = $bindable(),
	size,
	value = $bindable(),
	variant,
	...restProps
}: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props()

const ctx = getToggleGroupCtx()
</script>

<ToggleGroupPrimitive.Item
	class={cn(
		toggleVariants({
			size: ctx.size || size,
			variant: ctx.variant || variant,
		}),
		className,
	)}
	{value}
	bind:ref
	{...restProps}
/>
