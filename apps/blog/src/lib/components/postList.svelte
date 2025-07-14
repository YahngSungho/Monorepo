<script module>
import { css } from '@emotion/css'
import IconText from '@library/ui/icon-text'
import Link from '@library/ui/link'
import { Check, ChevronRight } from '@lucide/svelte'
</script>

<script>
let { allMetadata } = $props()
</script>

<div
	style="
display: flex; flex-direction: column;
gap: var(--space-em-cqi-3xs-2xs); inline-size: 100%;
"
>
	{#each allMetadata as postMetadata (postMetadata.slug)}
		<Link
			class={css`
				display: block;
			`}
			current={postMetadata.current}
			href={`/posts/${postMetadata.slug}`}
		>
		{#if postMetadata.current}
			<IconText IconElement={ChevronRight}>
				{postMetadata.title}
			</IconText>
			{:else if postMetadata.visited}
				<IconText IconElement={Check}>
					{postMetadata.title}
				</IconText>
			{:else}
				<IconText IconElement={null}>
					{postMetadata.title}
				</IconText>
			{/if}
		</Link>
	{/each}
</div>
