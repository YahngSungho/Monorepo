import { Drawer as DrawerPrimitive } from "vaul-svelte";

import Root from "./drawer.svelte";
import Footer from "./drawer-footer.svelte";
import Header from "./drawer-header.svelte";
import NestedRoot from "./drawer-nested.svelte";
import Overlay from "./drawer-overlay.svelte";
import Title from "./drawer-title.svelte";
import Trigger from "./drawer-trigger.svelte";

const {Portal} = DrawerPrimitive;

export {
	//
	Root as Drawer,
	Footer as DrawerFooter,
	Header as DrawerHeader,
	NestedRoot as DrawerNestedRoot,
	Overlay as DrawerOverlay,
	Portal as DrawerPortal,
	Title as DrawerTitle,
	Trigger as DrawerTrigger,
	Footer,
	Header,
	NestedRoot,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
};

export {default as Close, default as DrawerClose} from "./drawer-close.svelte";
export {default as Content, default as DrawerContent} from "./drawer-content.svelte";
export {default as Description, default as DrawerDescription} from "./drawer-description.svelte";