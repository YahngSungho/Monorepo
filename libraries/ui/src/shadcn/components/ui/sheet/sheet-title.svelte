<script lang="ts">
import { Dialog as SheetPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: SheetPrimitive.TitleProps = $props()
</script>

<SheetPrimitive.Title
	class={cn('text-foreground text-lg font-semibold', className)}
	bind:ref
	{...restProps}
/>
