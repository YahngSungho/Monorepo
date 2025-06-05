<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.HeaderProps = $props()
</script>

<CalendarPrimitive.Header
	class={cn('relative flex w-full items-center justify-between pt-1', className)}
	bind:ref
	{...restProps}
/>
