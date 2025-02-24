<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui'

import { buttonVariants, type Props } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	isActive = false,
	page,
	ref = $bindable(null),
	size = 'icon',
	...restProps
}: PaginationPrimitive.PageProps &
	Props & {
		isActive: boolean
	} = $props()
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	class={cn(
		buttonVariants({
			size,
			variant: isActive ? 'outline' : 'ghost',
		}),
		className,
	)}
	children={children || Fallback}
	{...restProps}
/>
