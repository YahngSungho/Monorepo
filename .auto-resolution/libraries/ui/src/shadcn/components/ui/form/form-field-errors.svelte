<script lang="ts">
import type { WithoutChild } from 'bits-ui'
import * as FormPrimitive from 'formsnap'

import { cn } from '$shadcn/utils.js'

let {
	children: childrenProp,
	class: className,
	errorClasses,
	ref = $bindable(),
	...restProps
}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
	errorClasses?: string | undefined | undefined
} = $props()
</script>

<FormPrimitive.FieldErrors
	class={cn('text-destructive text-sm font-medium', className)}
	bind:ref
	{...restProps}
>
	{#snippet children({ errorProps, errors })}
		{#if childrenProp}
			{@render childrenProp({ errorProps, errors })}
		{:else}
			{#each errors as error}
				<div {...errorProps} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
