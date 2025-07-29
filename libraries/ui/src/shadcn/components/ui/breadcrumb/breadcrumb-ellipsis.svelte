<script lang="ts">


import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef, type WithoutChildren } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props()
</script>

<span
	bind:this={ref}
	class={cn('flex size-9 items-center justify-center', className)}
	aria-hidden="true"
	data-slot="breadcrumb-ellipsis"
	role="presentation"
	{...restProps}
>
	<iconify-icon icon="lucide:more-horizontal"></iconify-icon>
	<span class="sr-only">More</span>
</span>
