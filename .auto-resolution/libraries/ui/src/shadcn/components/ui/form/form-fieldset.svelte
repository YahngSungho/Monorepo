<script lang="ts" module>
import type { FormPath as _FormPath } from 'sveltekit-superforms'
type T = Record<string, unknown>
type U = _FormPath<T>
</script>

<script generics="T extends Record<string, unknown>, U extends _FormPath<T>" lang="ts">
import type { WithoutChild } from 'bits-ui'
import * as FormPrimitive from 'formsnap'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	form,
	name,
	ref = $bindable(),
	...restProps
}: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props()
</script>

<FormPrimitive.Fieldset {name} class={cn('space-y-2', className)} {form} bind:ref {...restProps} />
