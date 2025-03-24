<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: AvatarPrimitive.ImageProps = $props()
</script>

<AvatarPrimitive.Image
	class={cn('aspect-square h-full w-full', className)}
	bind:ref
	{...restProps}
/>
