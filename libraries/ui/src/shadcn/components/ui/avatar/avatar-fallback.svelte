<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
	class={cn('bg-muted flex h-full w-full items-center justify-center rounded-full', className)}
	bind:ref
	{...restProps}
/>
