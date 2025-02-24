import { Dialog as SheetPrimitive } from 'bits-ui'

const { Root } = SheetPrimitive
const { Close } = SheetPrimitive
const { Trigger } = SheetPrimitive
const { Portal } = SheetPrimitive

export {
	Close,
	Portal,
	Root,
	//
	Root as Sheet,
	Close as SheetClose,
	Portal as SheetPortal,
	Trigger as SheetTrigger,
	Trigger,
}

export { default as Content, default as SheetContent } from './sheet-content.svelte'
export { default as Description, default as SheetDescription } from './sheet-description.svelte'
export { default as Footer, default as SheetFooter } from './sheet-footer.svelte'
export { default as Header, default as SheetHeader } from './sheet-header.svelte'
export { default as Overlay, default as SheetOverlay } from './sheet-overlay.svelte'
export { default as SheetTitle, default as Title } from './sheet-title.svelte'
