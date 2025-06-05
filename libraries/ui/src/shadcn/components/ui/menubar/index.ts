import { Menubar as MenubarPrimitive } from "bits-ui";

import Root from "./menubar.svelte";
import GroupHeading from "./menubar-group-heading.svelte";
import Item from "./menubar-item.svelte";
import Label from "./menubar-label.svelte";
import RadioItem from "./menubar-radio-item.svelte";
import Separator from "./menubar-separator.svelte";
import Shortcut from "./menubar-shortcut.svelte";
import SubContent from "./menubar-sub-content.svelte";
import SubTrigger from "./menubar-sub-trigger.svelte";
import Trigger from "./menubar-trigger.svelte";

const {Menu} = MenubarPrimitive;
const {Sub} = MenubarPrimitive;
const {RadioGroup} = MenubarPrimitive;

export {
	GroupHeading,
	Item,
	Label,
	Menu,
	//
	Root as Menubar,
	GroupHeading as MenubarGroupHeading,
	Item as MenubarItem,
	Label as MenubarLabel,
	Menu as MenubarMenu,
	RadioGroup as MenubarRadioGroup,
	RadioItem as MenubarRadioItem,
	Separator as MenubarSeparator,
	Shortcut as MenubarShortcut,
	Sub as MenubarSub,
	SubContent as MenubarSubContent,
	SubTrigger as MenubarSubTrigger,
	Trigger as MenubarTrigger,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
};

export {default as CheckboxItem, default as MenubarCheckboxItem} from "./menubar-checkbox-item.svelte";
export {default as Content, default as MenubarContent} from "./menubar-content.svelte";
export {default as Group, default as MenubarGroup} from "./menubar-group.svelte";