<script lang="ts">
import { Tabs as TabsPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: TabsPrimitive.ListProps = $props()
</script>

<TabsPrimitive.List
	class={cn(
		'bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1',
		className,
	)}
	bind:ref
	{...restProps}
/>
