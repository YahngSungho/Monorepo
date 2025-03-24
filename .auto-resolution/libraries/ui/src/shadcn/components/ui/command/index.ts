import { Command as CommandPrimitive } from 'bits-ui'

const { Loading } = CommandPrimitive

export {
	//
	Loading as CommandLoading,
	Loading,
}

export { default as Command, default as Root } from './command.svelte'
export { default as CommandDialog, default as Dialog } from './command-dialog.svelte'
export { default as CommandEmpty, default as Empty } from './command-empty.svelte'
export { default as CommandGroup, default as Group } from './command-group.svelte'
export { default as CommandInput, default as Input } from './command-input.svelte'
export { default as CommandItem, default as Item } from './command-item.svelte'
export { default as CommandLinkItem, default as LinkItem } from './command-link-item.svelte'
export { default as CommandList, default as List } from './command-list.svelte'
export { default as CommandSeparator, default as Separator } from './command-separator.svelte'
export { default as CommandShortcut, default as Shortcut } from './command-shortcut.svelte'
