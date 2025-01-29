<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'
	import { cn } from '$shadcn/utils.js'

	let {
		ref = $bindable(null),
		portalProps,
		class: className,
		...restProps
	}: ContextMenuPrimitive.ContentProps & {
		portalProps?: ContextMenuPrimitive.PortalProps
	} = $props()
</script>

<ContextMenuPrimitive.Portal {...portalProps}>
	<ContextMenuPrimitive.Content
		bind:ref
		class={cn(
			`bg-popover text-popover-foreground focus:outline-hidden z-50 min-w-[8rem] rounded-md border p-1
			shadow-md`,
			className,
		)}
		{...restProps}
	/>
</ContextMenuPrimitive.Portal>
