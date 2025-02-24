<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(null), ...restProps }: AvatarPrimitive.ImageProps = $props()
</script>

<AvatarPrimitive.Image
	bind:ref
	class={cn('aspect-square h-full w-full', className)}
	{...restProps}
/>
