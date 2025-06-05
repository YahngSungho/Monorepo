import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

import RadioGroup from './context-menu-radio-group.svelte'
import RadioItem from './context-menu-radio-item.svelte'
import Separator from './context-menu-separator.svelte'
import Shortcut from './context-menu-shortcut.svelte'
import SubContent from './context-menu-sub-content.svelte'
import SubTrigger from './context-menu-sub-trigger.svelte'
import Trigger from './context-menu-trigger.svelte'
const { Sub } = ContextMenuPrimitive
const { Root } = ContextMenuPrimitive

export {
	//
	Root as ContextMenu,
	RadioItem as ContextMenuRadioItem,
	Separator as ContextMenuSeparator,
	Shortcut as ContextMenuShortcut,
	Sub as ContextMenuSub,
	SubContent as ContextMenuSubContent,
	SubTrigger as ContextMenuSubTrigger,
	Trigger as ContextMenuTrigger,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
}

export {
	default as CheckboxItem,
	default as ContextMenuCheckboxItem,
} from './context-menu-checkbox-item.svelte'
export { default as Content, default as ContextMenuContent } from './context-menu-content.svelte'
export { default as ContextMenuGroup, default as Group } from './context-menu-group.svelte'
export {
	default as ContextMenuGroupHeading,
	default as GroupHeading,
} from './context-menu-group-heading.svelte'
export { default as ContextMenuItem, default as Item } from './context-menu-item.svelte'
export { default as ContextMenuLabel, default as Label } from './context-menu-label.svelte'
export { default as ContextMenuRadioGroup } from './context-menu-radio-group.svelte'
