<script lang="ts">
import { Dialog as DialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: DialogPrimitive.DescriptionProps = $props()
</script>

<DialogPrimitive.Description
	bind:ref
	class={cn('text-muted-foreground text-sm', className)}
	{...restProps}
/>
