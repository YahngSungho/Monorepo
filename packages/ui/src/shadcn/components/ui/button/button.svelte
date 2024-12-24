<script module>
import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	defaultVariants: {
		size: 'default',
		variant: 'default',
	},
	variants: {
		size: {
			default: 'h-10 px-4 py-2',
			icon: 'h-10 w-10',
			lg: 'h-11 rounded-md px-8',
			sm: 'h-9 rounded-md px-3',
		},
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
			outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
		},
	},
});
</script>

<script>
import { cn } from '$shadcn/utils.js';

let {
	children,
	class: className,
	href = undefined,
	ref = $bindable(null),
	size = 'default',
	type = 'button',
	variant = 'default',
	...restProps
} = $props();
</script>

{#if href}
	<a bind:this={ref} class={cn(buttonVariants({ className, size, variant }))} {href} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ className, size, variant }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
