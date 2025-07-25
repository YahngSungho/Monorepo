<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'

import * as Tooltip from '$shadcn/components/ui/tooltip/index.js'
import { cn, type WithElementRef } from '$shadcn/utils'

import {
	SIDEBAR_COOKIE_MAX_AGE,
	SIDEBAR_COOKIE_NAME,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_ICON,
} from './constants.js'
import { setSidebar } from './context.svelte.js'

let {
	ref = $bindable(null),
	open = $bindable(true),
	onOpenChange = () => {},
	class: className,
	style,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	onOpenChange?: (open: boolean) => void
	open?: boolean
} = $props()

const sidebar = setSidebar({
	open: () => open,
	setOpen: (value: boolean) => {
		open = value
		onOpenChange(value)

		// This sets the cookie to keep the sidebar state.
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
	},
})
</script>

<svelte:window onkeydown={sidebar.handleShortcutKeydown} />

<Tooltip.Provider delayDuration={0}>
	<div
		bind:this={ref}
		style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style}"
		class={cn(
			'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
			className,
		)}
		data-slot="sidebar-wrapper"
		{...restProps}
	>
		{@render children?.()}
	</div>
</Tooltip.Provider>
