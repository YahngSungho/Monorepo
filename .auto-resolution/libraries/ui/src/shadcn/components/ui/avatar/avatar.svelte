<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: AvatarPrimitive.RootProps = $props()
</script>

<AvatarPrimitive.Root
	class={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
	bind:ref
	{...restProps}
/>
