<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<thead bind:this={ref} class={cn('[&_tr]:border-b', className)} {...restProps}>
	{@render children?.()}
</thead>
