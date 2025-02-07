<script lang="ts">
import type { HTMLAnchorAttributes } from 'svelte/elements'
import type { Snippet } from 'svelte'
import type { WithElementRef } from 'bits-ui'
import { cn } from '$shadcn/utils.js'

let {
	child,
	children,
	class: className,
	href,
	ref = $bindable(null),
	...restProps
}: WithElementRef<HTMLAnchorAttributes> & {
	child?: Snippet<[{ props: HTMLAnchorAttributes }]>
} = $props()

const attrs = $derived({
	class: cn('hover:text-foreground transition-colors', className),
	href,
	...restProps,
})
</script>

{#if child}
	{@render child({ props: attrs })}
{:else}
	<a bind:this={ref} {...attrs}>
		{@render children?.()}
	</a>
{/if}
