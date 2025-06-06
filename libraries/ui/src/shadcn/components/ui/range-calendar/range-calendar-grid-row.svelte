<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.GridRowProps = $props()
</script>

<RangeCalendarPrimitive.GridRow class={cn('flex', className)} bind:ref {...restProps} />
