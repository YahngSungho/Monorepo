<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: AlertDialogPrimitive.OverlayProps = $props()
</script>

<AlertDialogPrimitive.Overlay
	class={cn(
		`data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
		data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50`,
		className,
	)}
	data-slot="alert-dialog-overlay"
	bind:ref
	{...restProps}
/>
