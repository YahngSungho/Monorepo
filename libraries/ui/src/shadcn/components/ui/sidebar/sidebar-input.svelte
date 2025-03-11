<script lang="ts">
import type { ComponentProps } from 'svelte'

import { Input } from '$shadcn/components/ui/input/index.js'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	value = $bindable(''),
	...restProps
}: ComponentProps<typeof Input> = $props()
</script>

<Input
	class={cn(
		'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
		className,
	)}
	data-sidebar="input"
	bind:ref
	bind:value
	{...restProps}
/>
