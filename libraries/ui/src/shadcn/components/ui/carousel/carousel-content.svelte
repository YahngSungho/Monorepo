<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import emblaCarouselSvelte from 'embla-carousel-svelte'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

import { getEmblaContext } from './context.js'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

const emblaCtx = getEmblaContext('<Carousel.Content/>')
</script>

<!-- svelte-ignore event_directive_deprecated -->
<div
	class="overflow-hidden"
	use:emblaCarouselSvelte={{
		options: {
			container: '[data-embla-container]',
			slides: '[data-embla-slide]',
			...emblaCtx.options,
			axis: emblaCtx.orientation === 'horizontal' ? 'x' : 'y',
		},
		plugins: emblaCtx.plugins,
	}}
	on:emblaInit={emblaCtx.onInit}
>
	<div
		bind:this={ref}
		class={cn(
			'flex',
			emblaCtx.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
			className,
		)}
		data-embla-container=""
		{...restProps}
	>
		{@render children?.()}
	</div>
</div>
