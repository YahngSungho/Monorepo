import Root from './sidebar.svelte'
import Separator from './sidebar-separator.svelte'
import Trigger from './sidebar-trigger.svelte'

export {
	Separator,
	//
	Root as Sidebar,
	Separator as SidebarSeparator,
	Trigger as SidebarTrigger,
	Trigger,
}

export { useSidebar } from './context.svelte.js'
export { default as Content, default as SidebarContent } from './sidebar-content.svelte'
export { default as Footer, default as SidebarFooter } from './sidebar-footer.svelte'
export { default as Group, default as SidebarGroup } from './sidebar-group.svelte'
export {
	default as GroupAction,
	default as SidebarGroupAction,
} from './sidebar-group-action.svelte'
export {
	default as GroupContent,
	default as SidebarGroupContent,
} from './sidebar-group-content.svelte'
export { default as GroupLabel, default as SidebarGroupLabel } from './sidebar-group-label.svelte'
export { default as Header, default as SidebarHeader } from './sidebar-header.svelte'
export { default as Input, default as SidebarInput } from './sidebar-input.svelte'
export { default as Inset, default as SidebarInset } from './sidebar-inset.svelte'
export { default as Menu, default as SidebarMenu } from './sidebar-menu.svelte'
export { default as MenuAction, default as SidebarMenuAction } from './sidebar-menu-action.svelte'
export { default as MenuBadge, default as SidebarMenuBadge } from './sidebar-menu-badge.svelte'
export { default as MenuButton, default as SidebarMenuButton } from './sidebar-menu-button.svelte'
export { default as MenuItem, default as SidebarMenuItem } from './sidebar-menu-item.svelte'
export {
	default as MenuSkeleton,
	default as SidebarMenuSkeleton,
} from './sidebar-menu-skeleton.svelte'
export { default as MenuSub, default as SidebarMenuSub } from './sidebar-menu-sub.svelte'
export {
	default as MenuSubButton,
	default as SidebarMenuSubButton,
} from './sidebar-menu-sub-button.svelte'
export {
	default as MenuSubItem,
	default as SidebarMenuSubItem,
} from './sidebar-menu-sub-item.svelte'
export { default as Provider, default as SidebarProvider } from './sidebar-provider.svelte'
export { default as Rail, default as SidebarRail } from './sidebar-rail.svelte'
export { default as Root } from './sidebar.svelte'
