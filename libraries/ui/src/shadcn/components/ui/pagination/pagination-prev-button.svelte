<script lang="ts">
import 'iconify-icon'

import { Pagination as PaginationPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: PaginationPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<iconify-icon height="16" icon="lucide:chevron-left" width="16"></iconify-icon>
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	class={cn(
		buttonVariants({
			size: 'default',
			variant: 'ghost',
			class: 'gap-1 px-2.5 sm:pl-2.5',
		}),
		className,
	)}
	aria-label="Go to previous page"
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
