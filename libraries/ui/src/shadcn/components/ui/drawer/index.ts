import { Drawer as DrawerPrimitive } from 'vaul-svelte'

const { Portal } = DrawerPrimitive

export {
	//
	Portal as DrawerPortal,
	Portal,
}

export { default as Drawer, default as Root } from './drawer.svelte'
export { default as Close, default as DrawerClose } from './drawer-close.svelte'
export { default as Content, default as DrawerContent } from './drawer-content.svelte'
export { default as Description, default as DrawerDescription } from './drawer-description.svelte'
export { default as DrawerFooter, default as Footer } from './drawer-footer.svelte'
export { default as DrawerHeader, default as Header } from './drawer-header.svelte'
export { default as DrawerNestedRoot, default as NestedRoot } from './drawer-nested.svelte'
export { default as DrawerOverlay, default as Overlay } from './drawer-overlay.svelte'
export { default as DrawerTitle, default as Title } from './drawer-title.svelte'
export { default as DrawerTrigger, default as Trigger } from './drawer-trigger.svelte'
