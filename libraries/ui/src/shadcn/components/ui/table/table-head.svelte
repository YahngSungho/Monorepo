<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLThAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLThAttributes> = $props()
</script>

<th
	bind:this={ref}
	class={cn(
		'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</th>
