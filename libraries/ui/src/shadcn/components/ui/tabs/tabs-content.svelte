<script lang="ts">
import { Tabs as TabsPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(null), ...restProps }: TabsPrimitive.ContentProps = $props()
</script>

<TabsPrimitive.Content
	bind:ref
	class={cn(
		`ring-offset-background focus-visible:ring-ring focus-visible:outline-hidden mt-2
		focus-visible:ring-2 focus-visible:ring-offset-2`,
		className,
	)}
	{...restProps}
/>
