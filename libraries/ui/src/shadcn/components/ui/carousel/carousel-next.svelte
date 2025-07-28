<script lang="ts">
import 'iconify-icon'

import type { WithoutChildren } from 'bits-ui'

import { Button, type Props } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

import { getEmblaContext } from './context.js'

let {
	ref = $bindable(null),
	class: className,
	variant = 'outline',
	size = 'icon',
	...restProps
}: WithoutChildren<Props> = $props()

const emblaCtx = getEmblaContext('<Carousel.Next/>')
</script>

<Button
	class={cn(
		'absolute size-8 rounded-full',
		emblaCtx.orientation === 'horizontal' ?
			'-right-12 top-1/2 -translate-y-1/2'
		:	'-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
		className,
	)}
	data-slot="carousel-next"
	disabled={!emblaCtx.canScrollNext}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	{size}
	{variant}
	bind:ref
	{...restProps}
>
	<iconify-icon height="16" icon="lucide:arrow-right" width="16"></iconify-icon>
	<span class="sr-only">Next slide</span>
</Button>
