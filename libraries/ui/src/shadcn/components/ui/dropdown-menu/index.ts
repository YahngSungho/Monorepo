import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import RadioGroup from './dropdown-menu-radio-group.svelte'
import RadioItem from './dropdown-menu-radio-item.svelte'
import Separator from './dropdown-menu-separator.svelte'
import Shortcut from './dropdown-menu-shortcut.svelte'
import SubContent from './dropdown-menu-sub-content.svelte'
import SubTrigger from './dropdown-menu-sub-trigger.svelte'
import Trigger from './dropdown-menu-trigger.svelte'
const { Sub } = DropdownMenuPrimitive
const { Root } = DropdownMenuPrimitive

export {
	Root as DropdownMenu,
	RadioItem as DropdownMenuRadioItem,
	Separator as DropdownMenuSeparator,
	Shortcut as DropdownMenuShortcut,
	Sub as DropdownMenuSub,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	Trigger as DropdownMenuTrigger,
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
	default as DropdownMenuCheckboxItem,
} from './dropdown-menu-checkbox-item.svelte'
export { default as Content, default as DropdownMenuContent } from './dropdown-menu-content.svelte'
export { default as DropdownMenuGroup, default as Group } from './dropdown-menu-group.svelte'
export {
	default as DropdownMenuGroupHeading,
	default as GroupHeading,
} from './dropdown-menu-group-heading.svelte'
export { default as DropdownMenuItem, default as Item } from './dropdown-menu-item.svelte'
export { default as DropdownMenuLabel, default as Label } from './dropdown-menu-label.svelte'
export { default as DropdownMenuRadioGroup } from './dropdown-menu-radio-group.svelte'
