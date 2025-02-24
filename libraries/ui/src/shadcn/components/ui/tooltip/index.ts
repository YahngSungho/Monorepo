import { Tooltip as TooltipPrimitive } from 'bits-ui'

const { Root } = TooltipPrimitive
const { Trigger } = TooltipPrimitive
const { Provider } = TooltipPrimitive

export {
	Provider,
	Root,
	//
	Root as Tooltip,
	Provider as TooltipProvider,
	Trigger as TooltipTrigger,
	Trigger,
}

export { default as Content, default as TooltipContent } from './tooltip-content.svelte'
