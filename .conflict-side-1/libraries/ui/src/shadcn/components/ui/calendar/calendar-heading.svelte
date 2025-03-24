<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: CalendarPrimitive.HeadingProps = $props()
</script>

<CalendarPrimitive.Heading class={cn('text-sm font-medium', className)} bind:ref {...restProps} />
