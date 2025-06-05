import Root from "./navigation-menu.svelte";
import Link from "./navigation-menu-link.svelte";
import List from "./navigation-menu-list.svelte";
import Trigger from "./navigation-menu-trigger.svelte";
import Viewport from "./navigation-menu-viewport.svelte";

export {
	Link,
	List,
	Link as NavigationMenuLink,
	List as NavigationMenuList,
	//
	Root as NavigationMenuRoot,
	Trigger as NavigationMenuTrigger,
	Viewport as NavigationMenuViewport,
	Root,
	Trigger,
	Viewport,
};

export {default as Content, default as NavigationMenuContent} from "./navigation-menu-content.svelte";
export {default as Indicator, default as NavigationMenuIndicator} from "./navigation-menu-indicator.svelte";
export {default as Item, default as NavigationMenuItem} from "./navigation-menu-item.svelte";