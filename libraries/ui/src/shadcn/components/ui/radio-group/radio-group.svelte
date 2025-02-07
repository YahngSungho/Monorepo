<script lang="ts">
import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	value = $bindable(''),
	...restProps
}: RadioGroupPrimitive.RootProps = $props()
</script>

<RadioGroupPrimitive.Root bind:ref bind:value class={cn('grid gap-2', className)} {...restProps} />
