<script lang="ts" module>
import { tv, type VariantProps } from 'tailwind-variants'

export const alertVariants = tv({
	base: '[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-background text-foreground',
			destructive:
				'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
		},
	},
})

export type AlertVariant = VariantProps<typeof alertVariants>['variant']
</script>

<script lang="ts">
import type { WithElementRef } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'

import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	ref = $bindable(null),
	variant = 'default',
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	variant?: AlertVariant
} = $props()
</script>

<div bind:this={ref} class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
	{@render children?.()}
</div>
