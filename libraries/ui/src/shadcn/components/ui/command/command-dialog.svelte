<script lang="ts">
import type {
	Command as CommandPrimitive,
	Dialog as DialogPrimitive,
	WithoutChildrenOrChild,
} from 'bits-ui'
import type { Snippet } from 'svelte'

import * as Dialog from '$shadcn/components/ui/dialog/index.js'

import Command from './command.svelte'

let {
	children,
	open = $bindable(false),
	portalProps,
	ref = $bindable(null),
	value = $bindable(''),
	...restProps
}: WithoutChildrenOrChild<CommandPrimitive.RootProps> &
	WithoutChildrenOrChild<DialogPrimitive.RootProps> & {
		children: Snippet
		portalProps?: DialogPrimitive.PortalProps
	} = $props()
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Content class="overflow-hidden p-0 shadow-lg" {portalProps}>
		<Command
			class="**:data-command-group:px-2 **:data-command-input:h-12 **:data-command-item:px-2
				**:data-command-item:py-3 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0
				[&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5
				[&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
			{...restProps}
			bind:value
			bind:ref
			{children}
		/>
	</Dialog.Content>
</Dialog.Root>
