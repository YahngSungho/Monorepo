import { Dialog as SheetPrimitive } from 'bits-ui'

import Title from './sheet-title.svelte'
import Trigger from './sheet-trigger.svelte'

const { Root } = SheetPrimitive
const { Portal } = SheetPrimitive

export {
	Portal,
	Root,
	//
	Root as Sheet,
	Portal as SheetPortal,
	Trigger as SheetTrigger,
	Title,
	Trigger,
}

export { default as Close, default as SheetClose } from './sheet-close.svelte'
export { default as Content, default as SheetContent } from './sheet-content.svelte'
export { default as Description, default as SheetDescription } from './sheet-description.svelte'
export { default as Footer, default as SheetFooter } from './sheet-footer.svelte'
export { default as Header, default as SheetHeader } from './sheet-header.svelte'
export { default as Overlay, default as SheetOverlay } from './sheet-overlay.svelte'
export { default as SheetTitle } from './sheet-title.svelte'
