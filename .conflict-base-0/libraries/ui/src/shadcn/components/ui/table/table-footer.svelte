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

<tfoot bind:this={ref} class={cn('bg-muted/50 font-medium', className)} {...restProps}>
	{@render children?.()}
</tfoot>
