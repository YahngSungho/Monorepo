<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui'
import ChevronRight from 'lucide-svelte/icons/chevron-right'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: PaginationPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
	<span>Next</span>
	<ChevronRight class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	class={cn(
		buttonVariants({
			class: 'gap-1 pr-2.5',
			variant: 'ghost',
		}),
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
