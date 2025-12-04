<script module>
import { css } from '@emotion/css'
import IconText from '@library/ui/icon-text'
import Link from '@library/ui/link'
import { balancer } from 'svelte-action-balancer'
</script>

<script>
let { linkObjectArray } = $props()
</script>

<div
	style:display="flex"
	style:flex-direction="column"
	style:gap="var(--space-em-cqi-2xs)"
	style:inline-size="100%"
>
	{#each linkObjectArray as linkObject (linkObject.href)}
		<span use:balancer={{ enabled: true, ratio: 0.7 }}>
			{#snippet link()}
				<Link
					class={css`
						display: block;
						inline-size: fit-content;
					`}
					active={linkObject.current}
					href={linkObject.href}
				>
					{linkObject.title}
				</Link>
			{/snippet}

			{#if linkObject.current}
				<IconText iconName="mdi:chevron-right">
					{@render link()}
				</IconText>
			{:else if linkObject.visited}
				<IconText iconName="mdi:check">
					{@render link()}
				</IconText>
			{:else}
				<IconText>
					{@render link()}
				</IconText>
			{/if}
		</span>
	{/each}
</div>
