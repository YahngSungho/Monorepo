<script lang="ts">
import { Select as SelectPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: SelectPrimitive.GroupHeadingProps = $props()
</script>

<SelectPrimitive.GroupHeading
	class={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
	bind:ref
	{...restProps}
/>
