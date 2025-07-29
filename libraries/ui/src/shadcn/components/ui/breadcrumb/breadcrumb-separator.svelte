<script lang="ts">


import type { HTMLLiAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li
	bind:this={ref}
	class={cn('[&>svg]:size-3.5', className)}
	aria-hidden="true"
	data-slot="breadcrumb-separator"
	role="presentation"
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		<iconify-icon height="16" icon="lucide:chevron-right" width="16"></iconify-icon>
	{/if}
</li>
