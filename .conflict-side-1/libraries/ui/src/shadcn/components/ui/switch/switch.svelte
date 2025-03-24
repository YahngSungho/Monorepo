<script lang="ts">
import { Switch as SwitchPrimitive, type WithoutChildrenOrChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	checked = $bindable(false),
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props()
</script>

<SwitchPrimitive.Root
	class={cn(
		`focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary
		data-[state=unchecked]:bg-input focus-visible:outline-hidden peer inline-flex h-6 w-11 shrink-0
		cursor-pointer items-center rounded-full border-2 border-transparent transition-colors
		focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
		className,
	)}
	bind:ref
	bind:checked
	{...restProps}
>
	<SwitchPrimitive.Thumb
		class={cn(
			`bg-background pointer-events-none block size-5 rounded-full shadow-lg ring-0 transition-transform
			data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`,
		)}
	/>
</SwitchPrimitive.Root>
