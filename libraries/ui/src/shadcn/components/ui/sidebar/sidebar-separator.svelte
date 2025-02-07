<script lang="ts">
import { Separator } from '$shadcn/components/ui/separator/index.js'
import { cn } from '$shadcn/utils.js'
import type { ComponentProps } from 'svelte'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: ComponentProps<typeof Separator> = $props()
</script>

<Separator
	bind:ref
	data-sidebar="separator"
	class={cn('bg-sidebar-border mx-2 w-auto', className)}
	{...restProps}
/>
