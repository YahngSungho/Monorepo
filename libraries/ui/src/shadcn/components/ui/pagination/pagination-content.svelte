<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props()
</script>

<ul bind:this={ref} class={cn('flex flex-row items-center gap-1', className)} {...restProps}>
	{@render children?.()}
</ul>
