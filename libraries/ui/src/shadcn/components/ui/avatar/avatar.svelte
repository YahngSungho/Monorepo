<script lang="ts">
import { Avatar as AvatarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let { ref = $bindable(null), class: className, ...restProps }: AvatarPrimitive.RootProps = $props()
</script>

<AvatarPrimitive.Root
	class={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
	data-slot="avatar"
	bind:ref
	{...restProps}
/>
