<script lang="ts">


import type { ComponentProps } from 'svelte'

import { Button } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

import { useSidebar } from './context.svelte.js'

let {
	ref = $bindable(null),
	class: className,
	onclick,
	...restProps
}: ComponentProps<typeof Button> & {
	onclick?: (e: MouseEvent) => void
} = $props()

const sidebar = useSidebar()
</script>

<Button
	class={cn('size-7', className)}
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	onclick={(e) => {
		onclick?.(e)
		sidebar.toggle()
	}}
	size="icon"
	type="button"
	variant="ghost"
	{...restProps}
>
	<iconify-icon height="16" icon="lucide:panel-left" width="16"></iconify-icon>
	<span class="sr-only">Toggle Sidebar</span>
</Button>
