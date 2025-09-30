<script module>
import { css } from '@emotion/css'
import IconText from '@library/ui/icon-text'
import Link from '@library/ui/link'
</script>

<script>
let { allMetadata } = $props()
</script>

<div
	style:display="flex"
	style:flex-direction="column"
	style:gap="var(--space-em-cqi-2xs)"
	style:inline-size="100%"
>
	{#each allMetadata as postMetadata (postMetadata.slug)}
		<div style="display: flex;">
			{#snippet link()}
			<Link
			class={css`
				display: block;
				inline-size: fit-content;
			`}
			active={postMetadata.current}
			href={`/posts/${postMetadata.slug}`}
		>
			{postMetadata.title}
		</Link>
		{/snippet}

		{#if postMetadata.current}
		<IconText iconName="mdi:chevron-right">
			{@render link()}
		</IconText>
	{:else if postMetadata.visited}
		<IconText iconName="mdi:check">
			{@render link()}
		</IconText>
	{:else}
		<IconText>
			{@render link()}
		</IconText>
	{/if}
		</div>
	{/each}
</div>
