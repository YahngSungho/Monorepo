<script lang="ts">
import { Command as CommandPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: CommandPrimitive.EmptyProps = $props()
</script>

<CommandPrimitive.Empty class={cn('py-6 text-center text-sm', className)} {...restProps} />
