import { Menubar as MenubarPrimitive } from 'bits-ui'

import SubContent from './menubar-sub-content.svelte'
import SubTrigger from './menubar-sub-trigger.svelte'
import Trigger from './menubar-trigger.svelte'

const { Menu } = MenubarPrimitive
const { Sub } = MenubarPrimitive
const { RadioGroup } = MenubarPrimitive

export {
	Menu,
	//
	Menu as MenubarMenu,
	RadioGroup as MenubarRadioGroup,
	Sub as MenubarSub,
	SubContent as MenubarSubContent,
	SubTrigger as MenubarSubTrigger,
	Trigger as MenubarTrigger,
	RadioGroup,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
}

export { default as Menubar, default as Root } from './menubar.svelte'
export {
	default as CheckboxItem,
	default as MenubarCheckboxItem,
} from './menubar-checkbox-item.svelte'
export { default as Content, default as MenubarContent } from './menubar-content.svelte'
export { default as Group, default as MenubarGroup } from './menubar-group.svelte'
export {
	default as GroupHeading,
	default as MenubarGroupHeading,
} from './menubar-group-heading.svelte'
export { default as Item, default as MenubarItem } from './menubar-item.svelte'
export { default as Label, default as MenubarLabel } from './menubar-label.svelte'
export { default as MenubarRadioItem, default as RadioItem } from './menubar-radio-item.svelte'
export { default as MenubarSeparator, default as Separator } from './menubar-separator.svelte'
export { default as MenubarShortcut, default as Shortcut } from './menubar-shortcut.svelte'
