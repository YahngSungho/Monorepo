<script module>
import { getLocale, setLocale } from '@library/paraglide/helpers'
import Button from '@library/ui/button_daisy'
import VariaitonSetter from '@library/ui/variaitonSetter'
</script>

<script>
const { data } = $props()
</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariaitonSetter {getLocale} {setLocale} />
</div>

<h1>Blog Posts</h1>

<div class="join">
	<Button class="join-item" href="/posts/test-post">Test Post</Button>
	<!-- 이 링크는 존재하지 않는 파일을 가리키므로, 404 에러를 테스트하는 데 사용할 수 있습니다. -->
	<Button class="join-item" href="/posts/another-post" variant="warning"
		>Another Post (will fail as example)</Button
	>
</div>

<p>
	{JSON.stringify(data.allMetadata)}
</p>

<div id="Page_Check"></div>
