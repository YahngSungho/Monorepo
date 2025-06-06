<script lang="ts">
import type { HTMLThAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLThAttributes> = $props()
</script>

<th
	bind:this={ref}
	class={cn(
		`text-foreground h-10 whitespace-nowrap px-2 text-left align-middle font-medium
		[&:has([role=checkbox])]:pr-0`,
		className,
	)}
	data-slot="table-head"
	{...restProps}
>
	{@render children?.()}
</th>
