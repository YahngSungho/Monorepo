<script lang="ts">
import { Accordion as AccordionPrimitive, type WithoutChild } from 'bits-ui'
import ChevronDown from 'lucide-svelte/icons/chevron-down'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	level = 3,
	ref = $bindable(),
	...restProps
}: WithoutChild<AccordionPrimitive.TriggerProps> & {
	level?: AccordionPrimitive.HeaderProps['level']
} = $props()
</script>

<AccordionPrimitive.Header class="flex" {level}>
	<AccordionPrimitive.Trigger
		class={cn(
			`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline
			[&[data-state=open]>svg]:rotate-180`,
			className,
		)}
		bind:ref
		{...restProps}
	>
		{@render children?.()}
		<ChevronDown class="size-4 shrink-0 transition-transform duration-200" />
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
