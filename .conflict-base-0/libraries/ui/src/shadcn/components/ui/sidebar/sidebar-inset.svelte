<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<main
	bind:this={ref}
	class={cn(
		'bg-background relative flex min-h-svh flex-1 flex-col',
		`peer-data-[variant=inset]:min-h-[calc(100svh-calc(var(--spacing)*4))]
		md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0
		md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2
		md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm`,
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</main>
