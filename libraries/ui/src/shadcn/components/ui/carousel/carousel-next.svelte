<script lang="ts">
import type { WithoutChildren } from 'bits-ui'
import ArrowRight from 'lucide-svelte/icons/arrow-right'

import { Button, type Props } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

import { getEmblaContext } from './context.js'

let {
	class: className,
	ref = $bindable(),
	size = 'icon',
	variant = 'outline',
	...restProps
}: WithoutChildren<Props> = $props()

const emblaCtx = getEmblaContext('<Carousel.Next/>')
</script>

<Button
	class={cn(
		'absolute size-8 touch-manipulation rounded-full',
		emblaCtx.orientation === 'horizontal' ?
			'-right-12 top-1/2 -translate-y-1/2'
		:	'-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
		className,
	)}
	disabled={!emblaCtx.canScrollNext}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	{size}
	{variant}
	bind:ref
	{...restProps}
>
	<ArrowRight class="size-4" />
	<span class="sr-only">Next slide</span>
</Button>
