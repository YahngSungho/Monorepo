<script lang="ts">
import { cn } from '$shadcn/utils.js'
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

let {
	children,
	class: className,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props()
</script>

<li
	bind:this={ref}
	data-sidebar="menu-item"
	class={cn('group/menu-item relative', className)}
	{...restProps}
>
	{@render children?.()}
</li>
