<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLTableAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLTableAttributes> = $props()
</script>

<div class="relative overflow-auto">
	<table bind:this={ref} class={cn('caption-bottom text-sm', className)} {...restProps}>
		{@render children?.()}
	</table>
</div>
