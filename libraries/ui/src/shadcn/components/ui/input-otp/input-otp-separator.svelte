<script lang="ts">


import type { HTMLAttributes } from 'svelte/elements'

import type { WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div bind:this={ref} data-slot="input-otp-separator" role="separator" {...restProps}>
	{#if children}
		{@render children?.()}
	{:else}
		<iconify-icon icon="lucide:dot"></iconify-icon>
	{/if}
</div>
