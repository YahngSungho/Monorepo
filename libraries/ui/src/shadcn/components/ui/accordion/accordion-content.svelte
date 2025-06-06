<script lang="ts">
import { Accordion as AccordionPrimitive } from 'bits-ui'

import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithoutChild<AccordionPrimitive.ContentProps> = $props()
</script>

<AccordionPrimitive.Content
	class={cn(
		`data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden
		text-sm`,
		className,
	)}
	data-slot="accordion-content"
	bind:ref
	{...restProps}
>
	<div class="pb-4 pt-0">
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
