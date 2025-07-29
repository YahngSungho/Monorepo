<script lang="ts">


import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: RangeCalendarPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<iconify-icon height="16" icon="lucide:chevron-left" width="16"></iconify-icon>
{/snippet}

<RangeCalendarPrimitive.PrevButton
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
