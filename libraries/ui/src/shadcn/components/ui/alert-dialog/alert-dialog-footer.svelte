<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	bind:this={ref}
	class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
	data-slot="alert-dialog-footer"
	{...restProps}
>
	{@render children?.()}
</div>
