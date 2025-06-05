<script lang="ts">
	import * as FormPrimitive from "formsnap";

	import { cn, type WithoutChild } from "$shadcn/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...restProps
	}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
		errorClasses?: null | string | undefined;
	} = $props();
</script>

<FormPrimitive.FieldErrors
	class={cn("text-destructive text-sm font-medium", className)}
	bind:ref
	{...restProps}
>
	{#snippet children({ errors, errorProps })}
		{#if childrenProp}
			{@render childrenProp({ errors, errorProps })}
		{:else}
			{#each errors as error (error)}
				<div {...errorProps} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
