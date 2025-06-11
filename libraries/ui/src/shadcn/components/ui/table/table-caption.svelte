<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<caption
	bind:this={ref}
	class={cn('text-muted-foreground mt-4 text-sm', className)}
	data-slot="table-caption"
	{...restProps}
>
	{@render children?.()}
</caption>
