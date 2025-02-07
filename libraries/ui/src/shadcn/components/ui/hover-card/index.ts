import { LinkPreview as HoverCardPrimitive } from 'bits-ui'


const Root = HoverCardPrimitive.Root
const Trigger = HoverCardPrimitive.Trigger

export {
	
	Root as HoverCard,
	
	Trigger as HoverCardTrigger,
	Root,
	Trigger,
}

export {default as Content, default as HoverCardContent} from './hover-card-content.svelte'