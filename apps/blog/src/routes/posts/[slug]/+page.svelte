<script>
import { getLocale, setLocale } from '@library/paraglide/helpers'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Button from '@library/ui/button_daisy'
import Markdown from '@library/ui/markdown-blog'
import VariationSetter from '@library/ui/variationSetter'
import { getContext, onMount } from 'svelte'

/** @type {import('./$types').PageProps} */
let { data } = $props()

const getAllMetadata = getContext('getAllMetadata')
const markAsVisited = getContext('markAsVisited')
let allMetadata = $derived(getAllMetadata())

onMount(() => {
	markAsVisited(data.metadata?.slug)
})

</script>

<svelte:head>
	<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
	<title>{data.metadata.title} - sungho.blog</title>
</svelte:head>

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
		{JSON.stringify(allMetadata)}
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
