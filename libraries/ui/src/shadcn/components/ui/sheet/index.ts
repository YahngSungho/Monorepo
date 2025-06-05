import { Dialog as SheetPrimitive } from "bits-ui";

import Footer from "./sheet-footer.svelte";
import Header from "./sheet-header.svelte";
import Overlay from "./sheet-overlay.svelte";
import Title from "./sheet-title.svelte";
import Trigger from "./sheet-trigger.svelte";

const {Root} = SheetPrimitive;
const {Portal} = SheetPrimitive;

export {
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	//
	Root as Sheet,
	Footer as SheetFooter,
	Header as SheetHeader,
	Overlay as SheetOverlay,
	Portal as SheetPortal,
	Title as SheetTitle,
	Trigger as SheetTrigger,
	Title,
	Trigger,
};

export {default as Close, default as SheetClose} from "./sheet-close.svelte";
export {default as Content, default as SheetContent} from "./sheet-content.svelte";
export {default as Description, default as SheetDescription} from "./sheet-description.svelte";