<script lang="ts" module>
import { tv, type VariantProps } from 'tailwind-variants'
export const sheetVariants = tv({
	base: 'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
	defaultVariants: {
		side: 'right',
	},
	variants: {
		side: {
			bottom:
				'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
			left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
			right:
				'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
			top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
		},
	},
})

export type Side = VariantProps<typeof sheetVariants>['side']
</script>

<script lang="ts">
import { Dialog as SheetPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
import X from 'lucide-svelte/icons/x'
import type { Snippet } from 'svelte'

import { cn } from '$shadcn/utils.js'

import SheetOverlay from './sheet-overlay.svelte'

let {
	children,
	class: className,
	portalProps,
	ref = $bindable(),
	side = 'right',
	...restProps
}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
	children: Snippet
	portalProps?: SheetPrimitive.PortalProps
	side?: Side
} = $props()
</script>

<SheetPrimitive.Portal {...portalProps}>
	<SheetOverlay />
	<SheetPrimitive.Content class={cn(sheetVariants({ side }), className)} bind:ref {...restProps}>
		{@render children?.()}
		<SheetPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary focus:outline-hidden absolute
				right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2
				focus:ring-offset-2 disabled:pointer-events-none"
		>
			<X class="size-4" />
			<span class="sr-only">Close</span>
		</SheetPrimitive.Close>
	</SheetPrimitive.Content>
</SheetPrimitive.Portal>
