<script lang="ts">
import type { WithoutChild } from 'bits-ui'
import * as FormPrimitive from 'formsnap'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChild<FormPrimitive.LegendProps> = $props()
</script>

<FormPrimitive.Legend
	class={cn('data-fs-error:text-destructive text-sm font-medium leading-none', className)}
	bind:ref
	{...restProps}
/>
