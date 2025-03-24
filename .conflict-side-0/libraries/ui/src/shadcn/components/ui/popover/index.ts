import { Popover as PopoverPrimitive } from 'bits-ui'

const { Root } = PopoverPrimitive
const { Trigger } = PopoverPrimitive
const { Close } = PopoverPrimitive

export {
	Close,
	//
	Root as Popover,
	Close as PopoverClose,
	Trigger as PopoverTrigger,
	Root,
	Trigger,
}

export { default as Content, default as PopoverContent } from './popover-content.svelte'
