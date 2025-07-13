<script module>
import { getLocale, setLocale } from '@library/paraglide/helpers'
import Button from '@library/ui/button_daisy'
import VariationSetter from '@library/ui/variationSetter'
import { getContext } from 'svelte'
</script>

<script>

const getAllMetadata = getContext('getAllMetadata')
const allMetadata = $derived(getAllMetadata())

</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariationSetter {getLocale} {setLocale} />
</div>

<h1>Blog Posts</h1>

<div class="join">
	<Button variant="primary">Primary Button</Button>

	<Button class="join-item" href="/posts/test-post">Test Post</Button>
	<!-- 이 링크는 존재하지 않는 파일을 가리키므로, 404 에러를 테스트하는 데 사용할 수 있습니다. -->
	<Button class="join-item" href="/posts/another-post" variant="warning"
		>Another Post (will fail as example)</Button
	>
</div>

<p>
	{JSON.stringify(allMetadata)}
</p>

<div id="Page_Check"></div>
