<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: RangeCalendarPrimitive.HeadingProps = $props()
</script>

<RangeCalendarPrimitive.Heading
	bind:ref
	class={cn('text-sm font-medium', className)}
	{...restProps}
/>
