<script lang="ts">
import type { Separator as SeparatorPrimitive } from 'bits-ui'

import { Separator } from '$shadcn/components/ui/separator/index.js'
import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: SeparatorPrimitive.RootProps = $props()
</script>

<Separator class={cn('bg-muted -mx-1 my-1 h-px', className)} bind:ref {...restProps} />
