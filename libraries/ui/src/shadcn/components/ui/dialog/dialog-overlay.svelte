<script lang="ts">
import { Dialog as DialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: DialogPrimitive.OverlayProps = $props()
</script>

<DialogPrimitive.Overlay
	class={cn(
		`data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
		data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50`,
		className,
	)}
	data-slot="dialog-overlay"
	bind:ref
	{...restProps}
/>
