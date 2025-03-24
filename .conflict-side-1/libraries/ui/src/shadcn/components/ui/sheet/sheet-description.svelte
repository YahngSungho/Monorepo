<script lang="ts">
import { Dialog as SheetPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: SheetPrimitive.DescriptionProps = $props()
</script>

<SheetPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	bind:ref
	{...restProps}
/>
