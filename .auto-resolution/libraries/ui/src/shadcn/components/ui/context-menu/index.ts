import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

const { Sub } = ContextMenuPrimitive
const { Root } = ContextMenuPrimitive
const { Trigger } = ContextMenuPrimitive
const { Group } = ContextMenuPrimitive
const { RadioGroup } = ContextMenuPrimitive

export {
	//
	Root as ContextMenu,
	Group as ContextMenuGroup,
	RadioGroup as ContextMenuRadioGroup,
	Sub as ContextMenuSub,
	Trigger as ContextMenuTrigger,
	Group,
	RadioGroup,
	Root,
	Sub,
	Trigger,
}

export {
	default as CheckboxItem,
	default as ContextMenuCheckboxItem,
} from './context-menu-checkbox-item.svelte'
export { default as Content, default as ContextMenuContent } from './context-menu-content.svelte'
export {
	default as ContextMenuGroupHeading,
	default as GroupHeading,
} from './context-menu-group-heading.svelte'
export { default as ContextMenuItem, default as Item } from './context-menu-item.svelte'
export {
	default as ContextMenuRadioItem,
	default as RadioItem,
} from './context-menu-radio-item.svelte'
export {
	default as ContextMenuSeparator,
	default as Separator,
} from './context-menu-separator.svelte'
export { default as ContextMenuShortcut, default as Shortcut } from './context-menu-shortcut.svelte'
export {
	default as ContextMenuSubContent,
	default as SubContent,
} from './context-menu-sub-content.svelte'
export {
	default as ContextMenuSubTrigger,
	default as SubTrigger,
} from './context-menu-sub-trigger.svelte'
