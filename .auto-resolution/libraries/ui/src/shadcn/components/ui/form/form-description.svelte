<script lang="ts">
import type { WithoutChild } from 'bits-ui'
import * as FormPrimitive from 'formsnap'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChild<FormPrimitive.DescriptionProps> = $props()
</script>

<FormPrimitive.Description
	class={cn('text-muted-foreground text-sm', className)}
	bind:ref
	{...restProps}
/>
