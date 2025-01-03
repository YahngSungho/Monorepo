<script module>
import { tv } from 'tailwind-variants'

export const badgeVariants = tv({
	base: 'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
			outline: 'text-foreground',
			secondary:
				'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
		},
	},
})
</script>

<script>
import { cn } from '$shadcn/utils.js'

let {
	children,
	class: className,
	href,
	ref = $bindable(null),
	variant = 'default',
	...restProps
} = $props()
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	{href}
	class={cn(badgeVariants({ className, variant }))}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
