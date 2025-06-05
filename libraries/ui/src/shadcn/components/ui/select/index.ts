import { Select as SelectPrimitive } from "bits-ui";

import Label from "./select-label.svelte";
import ScrollDownButton from "./select-scroll-down-button.svelte";
import ScrollUpButton from "./select-scroll-up-button.svelte";
import Separator from "./select-separator.svelte";
import Trigger from "./select-trigger.svelte";

const {Root} = SelectPrimitive;

export {
	Label,
	Root,
	ScrollDownButton,
	ScrollUpButton,
	//
	Root as Select,
	Label as SelectLabel,
	ScrollDownButton as SelectScrollDownButton,
	ScrollUpButton as SelectScrollUpButton,
	Separator as SelectSeparator,
	Trigger as SelectTrigger,
	Separator,
	Trigger,
};

export {default as Content, default as SelectContent} from "./select-content.svelte";
export {default as Group, default as SelectGroup} from "./select-group.svelte";
export {default as Item, default as SelectItem} from "./select-item.svelte";