<script lang="ts" module>
import type { FormPath as _FormPath } from 'sveltekit-superforms'
type T = Record<string, unknown>
type U = _FormPath<T>
</script>

<script generics="T extends Record<string, unknown>, U extends _FormPath<T>" lang="ts">
import type { WithElementRef, WithoutChildren } from 'bits-ui'
import * as FormPrimitive from 'formsnap'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children: childrenProp,
	class: className,
	form,
	name,
	ref = $bindable(),
	...restProps
}: FormPrimitive.FieldProps<T, U> &
	WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props()
</script>

<FormPrimitive.Field {name} {form}>
	{#snippet children({ constraints, errors, tainted, value })}
		<div bind:this={ref} class={cn('space-y-2', className)} {...restProps}>
			{@render childrenProp?.({ constraints, errors, tainted, value: value as T[U] })}
		</div>
	{/snippet}
</FormPrimitive.Field>
