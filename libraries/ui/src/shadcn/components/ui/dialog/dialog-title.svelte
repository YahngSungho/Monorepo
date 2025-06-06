<script lang="ts">
import { Dialog as DialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none', className)}
	data-slot="dialog-title"
	bind:ref
	{...restProps}
/>
