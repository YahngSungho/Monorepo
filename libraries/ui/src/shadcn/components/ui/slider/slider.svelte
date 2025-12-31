<script lang="ts">
import { Slider as SliderPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	value = $bindable(),
	orientation = 'horizontal',
	class: className,
	...restProps
}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props()
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	class={cn(
		`relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full
		data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto
		data-[orientation=vertical]:flex-col data-[disabled]:opacity-50`,
		className,
	)}
	data-slot="slider"
	{orientation}
	bind:ref
	bind:value={value as never}
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span
			class={cn(
				`bg-muted relative grow overflow-hidden data-[orientation=horizontal]:h-1.5
				data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full
				data-[orientation=vertical]:w-1.5`,
			)}
			data-orientation={orientation}
			data-slot="slider-track"
		>
			<SliderPrimitive.Range
				class={cn(
					'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
				)}
				data-slot="slider-range"
			/>
		</span>
		{#each thumbs as thumb (thumb)}
			<SliderPrimitive.Thumb
				class="border-primary bg-background ring-ring/50 focus-visible:outline-hidden block size-4 shrink-0
					border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4
					disabled:pointer-events-none disabled:opacity-50"
				data-slot="slider-thumb"
				index={thumb}
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
