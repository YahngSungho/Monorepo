<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props()
</script>

<p
	bind:this={ref}
	class={cn('text-muted-foreground text-sm', className)}
	data-slot="card-description"
	{...restProps}
>
	{@render children?.()}
</p>
