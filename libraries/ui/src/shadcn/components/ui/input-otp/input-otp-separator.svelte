<script lang="ts">
import DotIcon from '@lucide/svelte/icons/dot'
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
		<DotIcon />
	{/if}
</div>
