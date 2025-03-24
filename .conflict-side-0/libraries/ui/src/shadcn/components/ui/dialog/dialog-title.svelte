<script lang="ts">
import { Dialog as DialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	bind:ref
	{...restProps}
/>
