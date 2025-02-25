<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLTdAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLTdAttributes> = $props()
</script>

<td
	bind:this={ref}
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...restProps}
>
	{@render children?.()}
</td>
