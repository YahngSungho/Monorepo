<script>
import { R } from '@library/helpers/R'
import { getLocale, setLocale } from '@library/paraglide/helpers'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Button from '@library/ui/button_daisy'
import Markdown from '@library/ui/markdown-blog'
import VariationSetter from '@library/ui/variationSetter'
import store from 'store'

/** @type {import('./$types').PageProps} */
let { data } = $props()

$effect(() => {
	if (!data.metadata) return

	const prevVisited = store.get('visited') || {}
	if (!prevVisited[data.metadata.slug]) {
		const newVisited = {
			...prevVisited,
			[data.metadata.slug]: true
		}
		store.set('visited', newVisited)
	}
})


const allMetadata1 = $derived.by(() => {
	const visited = store.get('visited') || {}
	return R.mapObject((metadata) => {
		return {
			...metadata,
			visited: Boolean(visited[metadata.slug])
		}
	})(data.allMetadata)
})

</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariationSetter {getLocale} {setLocale} />

	<div>
		<Button href="/">Home</Button>
	</div>
</div>

	<div>
		{JSON.stringify(data.metadata)}
	</div>

	<div>
		{JSON.stringify(allMetadata1)}
	</div>

<div
	style="
	overflow: visible;
	margin: auto;
	padding-inline: var(--space-em-cqi-m);
"
	class="boxed long-text"
>

{#if data.post}
<Markdown value={data.post} />
{/if}

</div>

<div id="Page_Check"></div>
