import { Dialog as DialogPrimitive } from 'bits-ui'








const Root = DialogPrimitive.Root
const Trigger = DialogPrimitive.Trigger
const Close = DialogPrimitive.Close
const Portal = DialogPrimitive.Portal

export {
	Close,
	
	
	//
	Root as Dialog,
	Close as DialogClose,
	
	
	
	
	
	Portal as DialogPortal,
	
	Trigger as DialogTrigger,
	
	
	
	Portal,
	Root,
	
	Trigger,
}

export {default as Content, default as DialogContent} from './dialog-content.svelte'
export {default as Description, default as DialogDescription} from './dialog-description.svelte'
export {default as DialogFooter, default as Footer} from './dialog-footer.svelte'
export {default as DialogHeader, default as Header} from './dialog-header.svelte'
export {default as DialogOverlay, default as Overlay} from './dialog-overlay.svelte'
export {default as DialogTitle, default as Title} from './dialog-title.svelte'