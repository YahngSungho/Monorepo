<script lang="ts">
import type { ComponentProps } from 'svelte'

import { Separator } from '$shadcn/components/ui/separator/index.js'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: ComponentProps<typeof Separator> = $props()
</script>

<Separator
	class={cn('bg-sidebar-border mx-2 w-auto', className)}
	data-sidebar="separator"
	bind:ref
	{...restProps}
/>
