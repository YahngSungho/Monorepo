<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.HeadCellProps = $props()
</script>

<CalendarPrimitive.HeadCell
	class={cn('text-muted-foreground w-8 text-[0.8rem] font-normal', className)}
	bind:ref
	{...restProps}
/>
