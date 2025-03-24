<script lang="ts">
import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	value = $bindable(''),
	...restProps
}: RadioGroupPrimitive.RootProps = $props()
</script>

<RadioGroupPrimitive.Root class={cn('grid gap-2', className)} bind:ref bind:value {...restProps} />
