<script lang="ts">
import { Pagination as PaginationPrimitive } from 'bits-ui'
import ChevronLeft from 'lucide-svelte/icons/chevron-left'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: PaginationPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<ChevronLeft class="size-4" />
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	class={cn(
		buttonVariants({
			class: 'gap-1 pl-2.5',
			variant: 'ghost',
		}),
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
