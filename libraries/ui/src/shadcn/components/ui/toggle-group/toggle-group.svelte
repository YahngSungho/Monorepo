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
	class: className,
	ref = $bindable(),
	size = 'default',
	value = $bindable(),
	variant = 'default',
	...restProps
}: ToggleGroupPrimitive.RootProps & ToggleVariants = $props()

setToggleGroupCtx({
	size,
	variant,
})
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<ToggleGroupPrimitive.Root
	class={cn('flex items-center justify-center gap-1', className)}
	bind:value={value as never}
	bind:ref
	{...restProps}
/>
