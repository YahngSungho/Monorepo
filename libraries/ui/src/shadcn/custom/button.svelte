<script lang="ts" module>
import type { WithElementRef } from 'bits-ui'
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
	base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
			outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
		},
	},
})

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

export type ButtonProps = WithElementRef<HTMLAnchorAttributes> &
	WithElementRef<HTMLButtonAttributes> & {
		variant?: ButtonVariant
	}
</script>

<script lang="ts">
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	href,
	ref = $bindable(null),
	type = 'button',
	variant = 'default',
	...restProps
}: ButtonProps = $props()
</script>

{#if href}
	<a
		bind:this={ref}
		role="button"
		class={cn(buttonVariants({ variant }), className)}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button bind:this={ref} class={cn(buttonVariants({ variant }), className)} {type} {...restProps}>
		{@render children?.()}
	</button>
{/if}
