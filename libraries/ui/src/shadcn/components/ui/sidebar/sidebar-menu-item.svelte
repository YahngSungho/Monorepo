<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props()
</script>

<li
	bind:this={ref}
	class={cn('group/menu-item relative', className)}
	data-sidebar="menu-item"
	{...restProps}
>
	{@render children?.()}
</li>
