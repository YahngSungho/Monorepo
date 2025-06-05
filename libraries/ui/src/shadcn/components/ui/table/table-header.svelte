<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<thead
	bind:this={ref}
	class={cn('[&_tr]:border-b', className)}
	data-slot="table-header"
	{...restProps}
>
	{@render children?.()}
</thead>
