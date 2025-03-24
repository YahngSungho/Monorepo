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

<tbody bind:this={ref} class={cn('[&_tr:last-child]:border-0', className)} {...restProps}>
	{@render children?.()}
</tbody>
