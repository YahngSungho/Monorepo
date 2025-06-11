<script generics="T extends Record<string, unknown>, U extends FormPath<T>" lang="ts">
import * as FormPrimitive from 'formsnap'
import type { FormPath } from 'sveltekit-superforms'

import { cn, type WithoutChild } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	form,
	name,
	...restProps
}: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props()
</script>

<FormPrimitive.Fieldset {name} class={cn('space-y-2', className)} {form} bind:ref {...restProps} />
