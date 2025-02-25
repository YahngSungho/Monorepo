<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: CalendarPrimitive.HeaderProps = $props()
</script>

<CalendarPrimitive.Header
	bind:ref
	class={cn('relative flex w-full items-center justify-between pt-1', className)}
	{...restProps}
/>
