<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: AlertDialogPrimitive.CancelProps = $props()
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
	bind:ref
	{...restProps}
/>
