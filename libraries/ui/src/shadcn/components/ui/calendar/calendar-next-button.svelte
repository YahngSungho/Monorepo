<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'
import ChevronRight from 'lucide-svelte/icons/chevron-right'

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
	<ChevronRight class="size-4" />
{/snippet}

<CalendarPrimitive.NextButton
	bind:ref
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
		className,
	)}
	children={children || Fallback}
	{...restProps}
/>
