<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props()
</script>

<p bind:this={ref} class={cn('text-muted-foreground text-sm', className)} {...restProps}>
	{@render children?.()}
</p>
