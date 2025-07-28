<script lang="ts">
import 'iconify-icon'

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
	data-slot="pagination-ellipsis"
	{...restProps}
>
	<iconify-icon height="16" icon="lucide:more-horizontal" width="16"></iconify-icon>
	<span class="sr-only">More pages</span>
</span>
