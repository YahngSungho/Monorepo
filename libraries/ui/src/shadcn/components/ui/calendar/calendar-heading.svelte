<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.HeadingProps = $props()
</script>

<CalendarPrimitive.Heading class={cn('text-sm font-medium', className)} bind:ref {...restProps} />
