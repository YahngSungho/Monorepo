<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

import { getEmblaContext } from './context.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

const emblaCtx = getEmblaContext('<Carousel.Item/>')
</script>

<div
	bind:this={ref}
	class={cn(
		'min-w-0 shrink-0 grow-0 basis-full',
		emblaCtx.orientation === 'horizontal' ? 'pl-4' : 'pt-4',
		className,
	)}
	aria-roledescription="slide"
	data-embla-slide=""
	role="group"
	{...restProps}
>
	{@render children?.()}
</div>
