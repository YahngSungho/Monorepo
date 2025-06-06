<script lang="ts">
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: RangeCalendarPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
	<ChevronRightIcon class="size-4" />
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
