<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('flex flex-col gap-2 text-center sm:text-left', className)}
	data-slot="alert-dialog-header"
	{...restProps}
>
	{@render children?.()}
</div>
