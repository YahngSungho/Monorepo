<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLInputAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	value = $bindable(),
	...restProps
}: WithElementRef<HTMLInputAttributes> = $props()
</script>

<input
	bind:this={ref}
	class={cn(
		`border-input bg-background ring-offset-background placeholder:text-muted-foreground
		focus-visible:ring-ring focus-visible:outline-hidden flex h-10 w-full rounded-md border px-3 py-2
		text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2
		focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
		className,
	)}
	bind:value
	{...restProps}
/>
