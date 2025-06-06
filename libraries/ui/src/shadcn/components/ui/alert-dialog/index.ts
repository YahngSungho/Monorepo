import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

const { Root } = AlertDialogPrimitive
const { Portal } = AlertDialogPrimitive

export {
	//
	Root as AlertDialog,
	Portal as AlertDialogPortal,
	Portal,
	Root,
}

export { default as Action, default as AlertDialogAction } from './alert-dialog-action.svelte'
export { default as AlertDialogCancel, default as Cancel } from './alert-dialog-cancel.svelte'
export { default as AlertDialogContent, default as Content } from './alert-dialog-content.svelte'
export {
	default as AlertDialogDescription,
	default as Description,
} from './alert-dialog-description.svelte'
export { default as AlertDialogFooter, default as Footer } from './alert-dialog-footer.svelte'
export { default as AlertDialogHeader, default as Header } from './alert-dialog-header.svelte'
export { default as AlertDialogOverlay, default as Overlay } from './alert-dialog-overlay.svelte'
export { default as AlertDialogTitle, default as Title } from './alert-dialog-title.svelte'
export { default as AlertDialogTrigger, default as Trigger } from './alert-dialog-trigger.svelte'
