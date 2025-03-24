import { Tabs as TabsPrimitive } from 'bits-ui'

const { Root } = TabsPrimitive

export {
	Root,
	//
	Root as Tabs,
}

export { default as Content, default as TabsContent } from './tabs-content.svelte'
export { default as List, default as TabsList } from './tabs-list.svelte'
export { default as TabsTrigger, default as Trigger } from './tabs-trigger.svelte'
