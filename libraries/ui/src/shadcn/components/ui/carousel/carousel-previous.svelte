<script lang="ts">
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import type { WithoutChildren } from "bits-ui";

	import { Button, type Props } from "$shadcn/components/ui/button/index.js";
	import { cn } from "$shadcn/utils.js";

	import { getEmblaContext } from "./context.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "icon",
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Previous/>");
</script>

<Button
	class={cn(
		"absolute size-8 rounded-full",
		emblaCtx.orientation === "horizontal"
			? "-left-12 top-1/2 -translate-y-1/2"
			: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
		className
	)}
	data-slot="carousel-previous"
	disabled={!emblaCtx.canScrollPrev}
	onclick={emblaCtx.scrollPrev}
	onkeydown={emblaCtx.handleKeyDown}
	{size}
	{variant}
	{...restProps}
	bind:ref
>
	<ArrowLeftIcon class="size-4" />
	<span class="sr-only">Previous slide</span>
</Button>
