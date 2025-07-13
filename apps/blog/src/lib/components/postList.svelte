<script module>
import { css } from '@emotion/css'
import IconText from '@library/ui/icon-text'
import Link from '@library/ui/link'
import { Check } from '@lucide/svelte'
</script>

<script>
const { postMetadata } = $props()
</script>

<div
	style="
display: flex; flex-direction: column;
gap: var(--space-em-cqi-3xs-2xs);inline-size: 100%;
"
>
	{#each postMetadata as item (item.slug)}
		<Link
			class={css`
				display: block;
			`}
			current={item.current}
			href={`/posts/${item.slug}`}
		>
			{#if item.visited || item.current}
				<IconText IconElement={Check}>
					{item.title}
				</IconText>
			{:else}
				<IconText IconElement={null}>
					{item.title}
				</IconText>
			{/if}
		</Link>
	{/each}
</div>
