<script lang="ts">
import PanelLeft from 'lucide-svelte/icons/panel-left'
import type { ComponentProps } from 'svelte'

import { Button } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

import { useSidebar } from './context.svelte.js'

let {
	class: className,
	onclick,
	ref = $bindable(),
	...restProps
}: ComponentProps<typeof Button> & {
	onclick?: (e: MouseEvent) => void
} = $props()

const sidebar = useSidebar()
</script>

<Button
	type="button"
	onclick={(e) => {
		onclick?.(e)
		sidebar.toggle()
	}}
	data-sidebar="trigger"
	variant="ghost"
	size="icon"
	class={cn('h-7 w-7', className)}
	{...restProps}
>
	<PanelLeft />
	<span class="sr-only">Toggle Sidebar</span>
</Button>
