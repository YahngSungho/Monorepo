import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

import Description from "./alert-dialog-description.svelte";
import Footer from "./alert-dialog-footer.svelte";
import Header from "./alert-dialog-header.svelte";
import Overlay from "./alert-dialog-overlay.svelte";
import Title from "./alert-dialog-title.svelte";
import Trigger from "./alert-dialog-trigger.svelte";

const {Root} = AlertDialogPrimitive;
const {Portal} = AlertDialogPrimitive;

export {
	//
	Root as AlertDialog,
	Description as AlertDialogDescription,
	Footer as AlertDialogFooter,
	Header as AlertDialogHeader,
	Overlay as AlertDialogOverlay,
	Portal as AlertDialogPortal,
	Title as AlertDialogTitle,
	Trigger as AlertDialogTrigger,
	Description,
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
};

export {default as Action, default as AlertDialogAction} from "./alert-dialog-action.svelte";
export {default as AlertDialogCancel, default as Cancel} from "./alert-dialog-cancel.svelte";
export {default as AlertDialogContent, default as Content} from "./alert-dialog-content.svelte";