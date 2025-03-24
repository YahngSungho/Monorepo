<script lang="ts">
import { cn } from '$shadcn/utils.js'

import {
	type CarouselAPI,
	type CarouselProps,
	type EmblaContext,
	setEmblaContext,
} from './context.js'

let {
	children,
	class: className,
	opts = {},
	orientation = 'horizontal',
	plugins = [],
	setApi = () => {},
	...restProps
}: CarouselProps = $props()

let carouselState = $state<EmblaContext>({
	api: undefined,
	canScrollNext: false,
	canScrollPrev: false,
	handleKeyDown,
	onInit,
	options: opts,
	orientation,
	plugins,
	scrollNext,
	scrollPrev,
	scrollSnaps: [],
	scrollTo,
	selectedIndex: 0,
})

setEmblaContext(carouselState)

function scrollPrev() {
	carouselState.api?.scrollPrev()
}
function scrollNext() {
	carouselState.api?.scrollNext()
}
function scrollTo(index: number, jump?: boolean) {
	carouselState.api?.scrollTo(index, jump)
}

function onSelect(api: CarouselAPI) {
	if (!api) return
	carouselState.canScrollPrev = api.canScrollPrev()
	carouselState.canScrollNext = api.canScrollNext()
	carouselState.selectedIndex = api.selectedScrollSnap()
}

$effect(() => {
	if (carouselState.api) {
		onSelect(carouselState.api)
		carouselState.api.on('select', onSelect)
		carouselState.api.on('reInit', onSelect)
	}
})

function handleKeyDown(e: KeyboardEvent) {
	if (e.key === 'ArrowLeft') {
		e.preventDefault()
		scrollPrev()
	} else if (e.key === 'ArrowRight') {
		e.preventDefault()
		scrollNext()
	}
}

$effect(() => {
	setApi(carouselState.api)
})

function onInit(event: CustomEvent<CarouselAPI>) {
	carouselState.api = event.detail

	carouselState.scrollSnaps = carouselState.api.scrollSnapList()
}

$effect(() => {
	return () => {
		carouselState.api?.off('select', onSelect)
	}
})
</script>

<div class={cn('relative', className)} aria-roledescription="carousel" role="region" {...restProps}>
	{@render children?.()}
</div>
