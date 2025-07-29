<script lang="ts">


import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: RangeCalendarPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
	<iconify-icon icon="lucide:chevron-right"></iconify-icon>
{/snippet}

<RangeCalendarPrimitive.NextButton
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
