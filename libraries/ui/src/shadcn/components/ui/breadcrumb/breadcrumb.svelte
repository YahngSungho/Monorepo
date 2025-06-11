<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import type { WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<nav
	bind:this={ref}
	class={className}
	aria-label="breadcrumb"
	data-slot="breadcrumb"
	{...restProps}
>
	{@render children?.()}
</nav>
