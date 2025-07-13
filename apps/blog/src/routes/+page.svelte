<script module>
import { getLocale, setLocale } from '@library/paraglide/helpers'
import VariationSetter from '@library/ui/variationSetter'
import { getContext } from 'svelte'
import PostList from '$lib/components/postList.svelte'
</script>

<script>

const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())

</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariationSetter {getLocale} {setLocale} />
</div>

<h1>Blog Posts</h1>

<div>
	<PostList {allMetadata} />
</div>
<p>
	{JSON.stringify(allMetadata)}
</p>

<div id="Page_Check"></div>
