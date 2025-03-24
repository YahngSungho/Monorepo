<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: RangeCalendarPrimitive.GridRowProps = $props()
</script>

<RangeCalendarPrimitive.GridRow class={cn('flex', className)} bind:ref {...restProps} />
