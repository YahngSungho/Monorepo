<script lang="ts">
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
import { Pagination as PaginationPrimitive } from 'bits-ui'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: PaginationPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
	<span>Next</span>
	<ChevronRightIcon class="size-4" />
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
