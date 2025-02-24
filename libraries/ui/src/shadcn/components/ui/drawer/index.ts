import { Drawer as DrawerPrimitive } from 'vaul-svelte'

const { Trigger } = DrawerPrimitive
const { Portal } = DrawerPrimitive
const { Close } = DrawerPrimitive

export {
	Close,
	//
	Close as DrawerClose,
	Portal as DrawerPortal,
	Trigger as DrawerTrigger,
	Portal,
	Trigger,
}

export { default as Content, default as DrawerContent } from './drawer-content.svelte'
export { default as Description, default as DrawerDescription } from './drawer-description.svelte'
export { default as DrawerFooter, default as Footer } from './drawer-footer.svelte'
export { default as DrawerHeader, default as Header } from './drawer-header.svelte'
export { default as DrawerNestedRoot, default as NestedRoot } from './drawer-nested.svelte'
export { default as DrawerOverlay, default as Overlay } from './drawer-overlay.svelte'
export { default as DrawerTitle, default as Title } from './drawer-title.svelte'
export { default as Drawer, default as Root } from './drawer.svelte'
