<script lang="ts">
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
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
	<ChevronLeftIcon class="size-4" />
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
