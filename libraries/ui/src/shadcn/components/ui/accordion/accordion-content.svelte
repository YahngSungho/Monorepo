<script lang="ts">
import { Accordion as AccordionPrimitive, type WithoutChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChild<AccordionPrimitive.ContentProps> = $props()
</script>

<AccordionPrimitive.Content
	class={cn(
		`data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden
		text-sm transition-all`,
		className,
	)}
	bind:ref
	{...restProps}
>
	<div class="pb-4 pt-0">
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
