<script lang="ts">
import { Dialog as SheetPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: SheetPrimitive.DescriptionProps = $props()
</script>

<SheetPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	data-slot="sheet-description"
	bind:ref
	{...restProps}
/>
