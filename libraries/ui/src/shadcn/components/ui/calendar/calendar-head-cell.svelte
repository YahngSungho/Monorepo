<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: CalendarPrimitive.HeadCellProps = $props()
</script>

<CalendarPrimitive.HeadCell
	bind:ref
	class={cn('text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal', className)}
	{...restProps}
/>
