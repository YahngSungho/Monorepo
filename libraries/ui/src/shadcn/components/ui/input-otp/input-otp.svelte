<script lang="ts">
import { PinInput as InputOTPPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	value = $bindable(''),
	...restProps
}: InputOTPPrimitive.RootProps = $props()
</script>

<InputOTPPrimitive.Root
	class={cn(
		'has-disabled:opacity-50 flex items-center gap-2 [&_input]:disabled:cursor-not-allowed',
		className,
	)}
	data-slot="input-otp"
	bind:ref
	bind:value
	{...restProps}
/>
