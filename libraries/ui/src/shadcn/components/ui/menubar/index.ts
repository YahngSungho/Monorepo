import { Menubar as MenubarPrimitive } from 'bits-ui'

const { Menu } = MenubarPrimitive
const { Group } = MenubarPrimitive
const { Sub } = MenubarPrimitive
const { RadioGroup } = MenubarPrimitive

export {
	Group,
	Menu,
	//
	Group as MenubarGroup,
	Menu as MenubarMenu,
	RadioGroup as MenubarRadioGroup,
	Sub as MenubarSub,
	RadioGroup,
	Sub,
}

export { default as Menubar, default as Root } from './menubar.svelte'
export {
	default as CheckboxItem,
	default as MenubarCheckboxItem,
} from './menubar-checkbox-item.svelte'
export { default as Content, default as MenubarContent } from './menubar-content.svelte'
export {
	default as GroupHeading,
	default as MenubarGroupHeading,
} from './menubar-group-heading.svelte'
export { default as Item, default as MenubarItem } from './menubar-item.svelte'
export { default as MenubarRadioItem, default as RadioItem } from './menubar-radio-item.svelte'
export { default as MenubarSeparator, default as Separator } from './menubar-separator.svelte'
export { default as MenubarShortcut, default as Shortcut } from './menubar-shortcut.svelte'
export { default as MenubarSubContent, default as SubContent } from './menubar-sub-content.svelte'
export { default as MenubarSubTrigger, default as SubTrigger } from './menubar-sub-trigger.svelte'
export { default as MenubarTrigger, default as Trigger } from './menubar-trigger.svelte'
