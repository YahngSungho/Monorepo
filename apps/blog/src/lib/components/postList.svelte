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
		<Link
			class={css`
				display: block;
				inline-size: fit-content;
			`}
			active={postMetadata.current}
			href={`/posts/${postMetadata.slug}`}
		>
			{#if postMetadata.current}
				<IconText iconName="mdi:chevron-right">
					{postMetadata.title}
				</IconText>
			{:else if postMetadata.visited}
				<IconText iconName="mdi:check">
					{postMetadata.title}
				</IconText>
			{:else}
				<IconText>
					{postMetadata.title}
				</IconText>
			{/if}
		</Link>
	{/each}
</div>
