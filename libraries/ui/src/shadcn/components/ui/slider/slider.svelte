<script lang="ts">
import { Slider as SliderPrimitive, type WithoutChildrenOrChild } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	value = $bindable(),
	...restProps
}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props()
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	class={cn('relative flex w-full touch-none select-none items-center', className)}
	bind:value={value as never}
	bind:ref
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
			<SliderPrimitive.Range class="bg-primary absolute h-full" />
		</span>
		{#each thumbs as thumb}
			<SliderPrimitive.Thumb
				class="border-primary bg-background ring-offset-background focus-visible:ring-ring
					focus-visible:outline-hidden block size-5 rounded-full border-2 transition-colors
					focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				index={thumb}
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
