import { Select as SelectPrimitive } from 'bits-ui'

import Separator from './select-separator.svelte'
import Trigger from './select-trigger.svelte'

const { Root } = SelectPrimitive

export {
	Root,
	//
	Root as Select,
	Trigger as SelectTrigger,
	Separator,
	Trigger,
}

export { default as Content, default as SelectContent } from './select-content.svelte'
export { default as Group, default as SelectGroup } from './select-group.svelte'
export { default as Item, default as SelectItem } from './select-item.svelte'
export { default as Label, default as SelectLabel } from './select-label.svelte'
export {
	default as ScrollDownButton,
	default as SelectScrollDownButton,
} from './select-scroll-down-button.svelte'
export {
	default as ScrollUpButton,
	default as SelectScrollUpButton,
} from './select-scroll-up-button.svelte'
export { default as SelectSeparator } from './select-separator.svelte'
