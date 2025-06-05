<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	import { cn, type WithElementRef } from "$shadcn/utils.js";

	import { getEmblaContext } from "./context.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Item/>");
</script>

<div
	bind:this={ref}
	class={cn(
		"min-w-0 shrink-0 grow-0 basis-full",
		emblaCtx.orientation === "horizontal" ? "pl-4" : "pt-4",
		className
	)}
	aria-roledescription="slide"
	data-embla-slide=""
	data-slot="carousel-item"
	role="group"
	{...restProps}
>
	{@render children?.()}
</div>
