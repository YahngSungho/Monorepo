import { Command as CommandPrimitive } from "bits-ui";

import Group from "./command-group.svelte";
import Input from "./command-input.svelte";
import Item from "./command-item.svelte";
import LinkItem from "./command-link-item.svelte";
import List from "./command-list.svelte";
import Separator from "./command-separator.svelte";
import Shortcut from "./command-shortcut.svelte";

const {Loading} = CommandPrimitive;

export {
	//
	Group as CommandGroup,
	Input as CommandInput,
	Item as CommandItem,
	LinkItem as CommandLinkItem,
	List as CommandList,
	Loading as CommandLoading,
	Separator as CommandSeparator,
	Shortcut as CommandShortcut,
	Group,
	Input,
	Item,
	LinkItem,
	List,
	Loading,
	Separator,
	Shortcut,
};

export {default as Command, default as Root} from "./command.svelte";
export {default as CommandDialog, default as Dialog} from "./command-dialog.svelte";
export {default as CommandEmpty, default as Empty} from "./command-empty.svelte";