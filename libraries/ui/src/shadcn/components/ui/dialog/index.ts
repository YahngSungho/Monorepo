import { Dialog as DialogPrimitive } from 'bits-ui'

const { Root } = DialogPrimitive
const { Portal } = DialogPrimitive

export {
	//
	Root as Dialog,
	Portal as DialogPortal,
	Portal,
	Root,
}

export { default as Close, default as DialogClose } from './dialog-close.svelte'
export { default as Content, default as DialogContent } from './dialog-content.svelte'
export { default as Description, default as DialogDescription } from './dialog-description.svelte'
export { default as DialogFooter, default as Footer } from './dialog-footer.svelte'
export { default as DialogHeader, default as Header } from './dialog-header.svelte'
export { default as DialogOverlay, default as Overlay } from './dialog-overlay.svelte'
export { default as DialogTitle, default as Title } from './dialog-title.svelte'
export { default as DialogTrigger, default as Trigger } from './dialog-trigger.svelte'
