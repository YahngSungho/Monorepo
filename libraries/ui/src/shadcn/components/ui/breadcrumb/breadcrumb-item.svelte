<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLLiAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li bind:this={ref} class={cn('inline-flex items-center gap-1.5', className)} {...restProps}>
	{@render children?.()}
</li>
