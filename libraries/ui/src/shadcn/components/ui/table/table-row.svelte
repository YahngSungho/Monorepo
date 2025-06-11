<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props()
</script>

<tr
	bind:this={ref}
	class={cn(
		'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
		className,
	)}
	data-slot="table-row"
	{...restProps}
>
	{@render children?.()}
</tr>
