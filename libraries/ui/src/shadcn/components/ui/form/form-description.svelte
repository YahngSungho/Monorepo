<script lang="ts">
import * as FormPrimitive from 'formsnap'

import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChild<FormPrimitive.DescriptionProps> = $props()
</script>

<FormPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	data-slot="form-description"
	bind:ref
	{...restProps}
/>
