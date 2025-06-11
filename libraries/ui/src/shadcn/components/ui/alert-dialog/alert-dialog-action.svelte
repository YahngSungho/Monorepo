<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: AlertDialogPrimitive.ActionProps = $props()
</script>

<AlertDialogPrimitive.Action
	class={cn(buttonVariants(), className)}
	data-slot="alert-dialog-action"
	bind:ref
	{...restProps}
/>
