<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
	class={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
	data-slot="avatar-fallback"
	bind:ref
	{...restProps}
/>
