<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: RangeCalendarPrimitive.HeadingProps = $props()
</script>

<RangeCalendarPrimitive.Heading
	class={cn('text-sm font-medium', className)}
	bind:ref
	{...restProps}
/>
