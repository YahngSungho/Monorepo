<script lang="ts">
import { Dialog as SheetPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.TitleProps = $props()
</script>

<SheetPrimitive.Title
	class={cn('text-foreground font-semibold', className)}
	data-slot="sheet-title"
	bind:ref
	{...restProps}
/>
