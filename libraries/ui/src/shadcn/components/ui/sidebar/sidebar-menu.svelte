<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props()
</script>

<ul
	bind:this={ref}
	data-sidebar="menu"
	class={cn('flex w-full min-w-0 flex-col gap-1', className)}
	{...restProps}
>
	{@render children?.()}
</ul>
