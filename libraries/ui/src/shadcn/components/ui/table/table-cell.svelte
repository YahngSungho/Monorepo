<script lang="ts">
import type { HTMLTdAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLTdAttributes> = $props()
</script>

<td
	bind:this={ref}
	class={cn('whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0', className)}
	data-slot="table-cell"
	{...restProps}
>
	{@render children?.()}
</td>
