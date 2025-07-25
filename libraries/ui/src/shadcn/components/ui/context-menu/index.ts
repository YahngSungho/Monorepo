import { ContextMenu as ContextMenuPrimitive } from 'bits-ui'

const { Sub } = ContextMenuPrimitive
const { Root } = ContextMenuPrimitive

export {
	//
	Root as ContextMenu,
	Sub as ContextMenuSub,
	Root,
	Sub,
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
export {
	default as ContextMenuRadioGroup,
	default as RadioGroup,
} from './context-menu-radio-group.svelte'
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
export { default as ContextMenuTrigger, default as Trigger } from './context-menu-trigger.svelte'
