<script module>
import { css } from '@emotion/css'
import IconText from '@library/ui/icon-text'
import Link from '@library/ui/link'
import { Check, ChevronRight } from '@lucide/svelte'

function scrollToTop() {
		setTimeout(() => {
			document.body.scrollTo({
				top: 0,
				behavior: 'instant'
			})
		}, 1)
	}
</script>

<script>
let { allMetadata } = $props()
</script>

<div
	style="
display: flex; flex-direction: column;
gap: var(--space-em-cqi-xs); inline-size: 100%;
"
>
	{#each allMetadata as postMetadata (postMetadata.slug)}
		<Link
			class={css`
				display: block;
				inline-size: fit-content;
			`}
			current={postMetadata.current}
			href={`/posts/${postMetadata.slug}`}
			onclick={scrollToTop}
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
