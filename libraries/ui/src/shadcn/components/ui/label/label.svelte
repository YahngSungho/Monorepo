<script lang="ts">
import { Label as LabelPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: LabelPrimitive.RootProps = $props()
</script>

<LabelPrimitive.Root
	class={cn(
		`flex select-none items-center gap-2 text-sm font-medium leading-none
		peer-disabled:cursor-not-allowed peer-disabled:opacity-50
		group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50`,
		className,
	)}
	data-slot="label"
	bind:ref
	{...restProps}
/>
