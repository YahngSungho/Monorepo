<script lang="ts">
import { Accordion as AccordionPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: AccordionPrimitive.ItemProps = $props()
</script>

<AccordionPrimitive.Item class={cn('border-b', className)} bind:ref {...restProps} />
