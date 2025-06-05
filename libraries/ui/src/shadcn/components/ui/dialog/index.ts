import { Dialog as DialogPrimitive } from "bits-ui";

import Footer from "./dialog-footer.svelte";
import Header from "./dialog-header.svelte";
import Overlay from "./dialog-overlay.svelte";
import Title from "./dialog-title.svelte";
import Trigger from "./dialog-trigger.svelte";

const {Root} = DialogPrimitive;
const {Portal} = DialogPrimitive;

export {
	//
	Root as Dialog,
	Footer as DialogFooter,
	Header as DialogHeader,
	Overlay as DialogOverlay,
	Portal as DialogPortal,
	Title as DialogTitle,
	Trigger as DialogTrigger,
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
};

export {default as Close, default as DialogClose} from "./dialog-close.svelte";
export {default as Content, default as DialogContent} from "./dialog-content.svelte";
export {default as Description, default as DialogDescription} from "./dialog-description.svelte";