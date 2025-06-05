<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";

	import { cn } from "$shadcn/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionPrimitive.ItemProps = $props();
</script>

<AccordionPrimitive.Item
	class={cn("border-b last:border-b-0", className)}
	data-slot="accordion-item"
	bind:ref
	{...restProps}
/>
