import { Popover as PopoverPrimitive } from 'bits-ui'

const { Root } = PopoverPrimitive
const { Close } = PopoverPrimitive

export {
	Close,
	//
	Root as Popover,
	Close as PopoverClose,
	Root,
}

export { default as Content, default as PopoverContent } from './popover-content.svelte'
export { default as PopoverTrigger, default as Trigger } from './popover-trigger.svelte'
