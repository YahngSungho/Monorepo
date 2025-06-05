import { Drawer as DrawerPrimitive } from 'vaul-svelte'

import NestedRoot from './drawer-nested.svelte'
import Overlay from './drawer-overlay.svelte'
import Title from './drawer-title.svelte'
import Trigger from './drawer-trigger.svelte'

const { Portal } = DrawerPrimitive

export {
	//

	Overlay as DrawerOverlay,
	Portal as DrawerPortal,
	Title as DrawerTitle,
	Trigger as DrawerTrigger,
	NestedRoot,
	Overlay,
	Portal,
	Title,
	Trigger,
}

export { default as Drawer, default as Root } from './drawer.svelte'
export { default as Close, default as DrawerClose } from './drawer-close.svelte'
export { default as Content, default as DrawerContent } from './drawer-content.svelte'
export { default as Description, default as DrawerDescription } from './drawer-description.svelte'
export { default as DrawerFooter, default as Footer } from './drawer-footer.svelte'
export { default as DrawerHeader, default as Header } from './drawer-header.svelte'
export { default as DrawerNestedRoot } from './drawer-nested.svelte'
