<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'
import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: RangeCalendarPrimitive.GridRowProps = $props()
</script>

<RangeCalendarPrimitive.GridRow bind:ref class={cn('flex', className)} {...restProps} />
