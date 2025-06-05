<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { Input } from "$shadcn/components/ui/input/index.js";
	import { cn } from "$shadcn/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	class={cn("bg-background h-8 w-full shadow-none", className)}
	data-sidebar="input"
	data-slot="sidebar-input"
	bind:ref
	bind:value
	{...restProps}
/>
