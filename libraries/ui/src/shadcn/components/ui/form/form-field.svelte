<script generics="T extends Record<string, unknown>, U extends FormPath<T>" lang="ts">
import * as FormPrimitive from 'formsnap'
import type { HTMLAttributes } from 'svelte/elements'
import type { FormPath } from 'sveltekit-superforms'

import { cn, type WithElementRef, type WithoutChildren } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	form,
	name,
	children: childrenProp,
	...restProps
}: FormPrimitive.FieldProps<T, U> &
	WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props()
</script>

<FormPrimitive.Field {name} {form}>
	{#snippet children({ constraints, errors, tainted, value })}
		<div bind:this={ref} class={cn('space-y-2', className)} data-slot="form-item" {...restProps}>
			{@render childrenProp?.({ constraints, errors, tainted, value: value as T[U] })}
		</div>
	{/snippet}
</FormPrimitive.Field>
