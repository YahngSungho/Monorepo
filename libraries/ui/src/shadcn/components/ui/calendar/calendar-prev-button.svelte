<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'
import ChevronLeft from 'lucide-svelte/icons/chevron-left'

import { buttonVariants } from '$shadcn/components/ui/button/index.js'
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(),
	...restProps
}: CalendarPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<ChevronLeft class="size-4" />
{/snippet}

<CalendarPrimitive.PrevButton
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	children={children || Fallback}
	bind:ref
	{...restProps}
/>
