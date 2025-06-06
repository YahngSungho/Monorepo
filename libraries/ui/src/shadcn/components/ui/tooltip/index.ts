import { Tooltip as TooltipPrimitive } from 'bits-ui'

const { Root } = TooltipPrimitive
const { Provider } = TooltipPrimitive
const { Portal } = TooltipPrimitive

export {
	Portal,
	Provider,
	Root,
	//
	Root as Tooltip,
	Portal as TooltipPortal,
	Provider as TooltipProvider,
}

export { default as Content, default as TooltipContent } from './tooltip-content.svelte'
export { default as TooltipTrigger, default as Trigger } from './tooltip-trigger.svelte'
