<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	level = 3,
	ref = $bindable(),
	...restProps
}: AlertDialogPrimitive.TitleProps = $props()
</script>

<AlertDialogPrimitive.Title
	class={cn('text-lg font-semibold', className)}
	{level}
	bind:ref
	{...restProps}
/>
