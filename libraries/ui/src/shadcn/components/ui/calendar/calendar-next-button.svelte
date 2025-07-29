<script lang="ts">


import { Calendar as CalendarPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: CalendarPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<iconify-icon height="16" icon="lucide:chevron-right" width="16"></iconify-icon>
{/snippet}

<CalendarPrimitive.NextButton
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
