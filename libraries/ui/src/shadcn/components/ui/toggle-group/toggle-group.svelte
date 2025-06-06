<script lang="ts" module>
import { getContext, setContext } from 'svelte'

import type { ToggleVariants } from '$shadcn/components/ui/toggle/index.js'
export function setToggleGroupCtx(props: ToggleVariants) {
	setContext('toggleGroup', props)
}

export function getToggleGroupCtx() {
	return getContext<ToggleVariants>('toggleGroup')
}
</script>

<script lang="ts">
import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	value = $bindable(),
	class: className,
	size = 'default',
	variant = 'default',
	...restProps
}: ToggleGroupPrimitive.RootProps & ToggleVariants = $props()

setToggleGroupCtx({
	variant,
	size,
})
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<ToggleGroupPrimitive.Root
	class={cn(
		'group/toggle-group data-[variant=outline]:shadow-xs flex w-fit items-center rounded-md',
		className,
	)}
	data-size={size}
	data-slot="toggle-group"
	data-variant={variant}
	bind:value={value as never}
	bind:ref
	{...restProps}
/>
