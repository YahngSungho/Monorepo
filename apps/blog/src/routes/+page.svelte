<script>
	import { getLocale, setLocale } from '@library/paraglide/helpers'
	import VariaitonSetter from '@library/ui/variaitonSetter'
	import Button from '@library/ui/button_daisy'
</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariaitonSetter {getLocale} {setLocale} />
</div>

<h1>Blog Posts</h1>

<ul>
	<li>
		<Button href='/posts/test-article'>Test Article</Button>
	</li>
	<li>
		<!-- 이 링크는 존재하지 않는 파일을 가리키므로, 404 에러를 테스트하는 데 사용할 수 있습니다. -->
		<Button variant='warning' href='/posts/another-post'>Another Post (will fail as example)</Button>
	</li>
</ul>
