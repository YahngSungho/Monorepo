<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props()
</script>

<ul
	bind:this={ref}
	class={cn('flex flex-row items-center gap-1', className)}
	data-slot="pagination-content"
	{...restProps}
>
	{@render children?.()}
</ul>
