import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

import SubContent from './dropdown-menu-sub-content.svelte'
import SubTrigger from './dropdown-menu-sub-trigger.svelte'
import Trigger from './dropdown-menu-trigger.svelte'
const { Sub } = DropdownMenuPrimitive
const { Root } = DropdownMenuPrimitive

export {
	Root as DropdownMenu,
	Sub as DropdownMenuSub,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	Trigger as DropdownMenuTrigger,
	Root,
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
export {
	default as DropdownMenuRadioGroup,
	default as RadioGroup,
} from './dropdown-menu-radio-group.svelte'
export {
	default as DropdownMenuRadioItem,
	default as RadioItem,
} from './dropdown-menu-radio-item.svelte'
export {
	default as DropdownMenuSeparator,
	default as Separator,
} from './dropdown-menu-separator.svelte'
export {
	default as DropdownMenuShortcut,
	default as Shortcut,
} from './dropdown-menu-shortcut.svelte'
