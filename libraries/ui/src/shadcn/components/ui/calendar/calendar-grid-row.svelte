<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: CalendarPrimitive.GridRowProps = $props()
</script>

<CalendarPrimitive.GridRow bind:ref class={cn('flex', className)} {...restProps} />
