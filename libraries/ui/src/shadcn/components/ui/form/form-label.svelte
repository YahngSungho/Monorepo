<script lang="ts">
import * as FormPrimitive from 'formsnap'

import { Label } from '$shadcn/components/ui/label/index.js'
import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	children,
	class: className,
	...restProps
}: WithoutChild<FormPrimitive.LabelProps> = $props()
</script>

<FormPrimitive.Label {...restProps} bind:ref>
	{#snippet child({ props })}
		<Label
			{...props}
			class={cn('data-[fs-error]:text-destructive', className)}
			data-slot="form-label"
		>
			{@render children?.()}
		</Label>
	{/snippet}
</FormPrimitive.Label>
