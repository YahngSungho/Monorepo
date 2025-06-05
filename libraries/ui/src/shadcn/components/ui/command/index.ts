import { Command as CommandPrimitive } from 'bits-ui'

import LinkItem from './command-link-item.svelte'
import List from './command-list.svelte'
import Separator from './command-separator.svelte'
import Shortcut from './command-shortcut.svelte'

const { Loading } = CommandPrimitive

export {
	//

	List as CommandList,
	Loading as CommandLoading,
	Separator as CommandSeparator,
	Shortcut as CommandShortcut,
	LinkItem,
	List,
	Loading,
	Separator,
	Shortcut,
}

export { default as Command, default as Root } from './command.svelte'
export { default as CommandDialog, default as Dialog } from './command-dialog.svelte'
export { default as CommandEmpty, default as Empty } from './command-empty.svelte'
export { default as CommandGroup, default as Group } from './command-group.svelte'
export { default as CommandInput, default as Input } from './command-input.svelte'
export { default as CommandItem, default as Item } from './command-item.svelte'
export { default as CommandLinkItem } from './command-link-item.svelte'
