<script lang="ts">
import { Tabs as TabsPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: TabsPrimitive.TriggerProps = $props()
</script>

<TabsPrimitive.Trigger
	bind:ref
	class={cn(
		`ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background
		data-[state=active]:text-foreground focus-visible:outline-hidden data-[state=active]:shadow-xs
		inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
		transition-all focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none
		disabled:opacity-50`,
		className,
	)}
	{...restProps}
/>
