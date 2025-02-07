<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'
import { getEmblaContext } from './context.js'
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

const emblaCtx = getEmblaContext('<Carousel.Item/>')
</script>

<div
	bind:this={ref}
	role="group"
	aria-roledescription="slide"
	class={cn(
		'min-w-0 shrink-0 grow-0 basis-full',
		emblaCtx.orientation === 'horizontal' ? 'pl-4' : 'pt-4',
		className,
	)}
	data-embla-slide=""
	{...restProps}
>
	{@render children?.()}
</div>
