<script lang="ts">
import { Separator as SeparatorPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: SeparatorPrimitive.RootProps = $props()
</script>

<SeparatorPrimitive.Root
	class={cn(
		`bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full
		data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`,
		className,
	)}
	data-slot="separator-root"
	bind:ref
	{...restProps}
/>
