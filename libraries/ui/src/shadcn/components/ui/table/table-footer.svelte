<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<tfoot
	bind:this={ref}
	class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
	data-slot="table-footer"
	{...restProps}
>
	{@render children?.()}
</tfoot>
