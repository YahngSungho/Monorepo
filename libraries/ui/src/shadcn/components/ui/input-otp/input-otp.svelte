<script lang="ts">
import { PinInput as InputOTPPrimitive } from 'bits-ui'
import type { ComponentProps } from 'svelte'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	value = $bindable(''),
	...restProps
}: ComponentProps<typeof InputOTPPrimitive.Root> = $props()
</script>

<InputOTPPrimitive.Root
	bind:ref
	bind:value
	class={cn(
		'has-disabled:opacity-50 flex items-center gap-2 disabled:[&_input]:cursor-not-allowed',
		className,
	)}
	{...restProps}
/>
