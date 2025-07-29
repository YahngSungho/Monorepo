<script lang="ts">


import { Pagination as PaginationPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: PaginationPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
	<span>Next</span>
	<iconify-icon height="16" icon="lucide:chevron-right" width="16"></iconify-icon>
{/snippet}

<PaginationPrimitive.NextButton
	class={cn(
		buttonVariants({
			size: 'default',
			variant: 'ghost',
			class: 'gap-1 px-2.5 sm:pr-2.5',
		}),
		className,
	)}
	aria-label="Go to next page"
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
