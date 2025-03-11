<script lang="ts">
import type { WithElementRef, WithoutChildren } from 'bits-ui'
import Ellipsis from 'lucide-svelte/icons/ellipsis'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props()
</script>

<span
	bind:this={ref}
	class={cn('flex size-9 items-center justify-center', className)}
	aria-hidden="true"
	role="presentation"
	{...restProps}
>
	<Ellipsis class="size-4" />
	<span class="sr-only">More</span>
</span>
