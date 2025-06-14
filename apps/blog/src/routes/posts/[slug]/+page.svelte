<script>
import { getLocale, setLocale } from '@library/paraglide/helpers'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Button from '@library/ui/button_daisy'
import Markdown from '@library/ui/markdown-blog'
import VariaitonSetter from '@library/ui/variaitonSetter'

/** @type {import('./$types').PageProps} */
let { data } = $props()

</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariaitonSetter {getLocale} {setLocale} />

	<div>
		<Button href='../../'>Home</Button>
	</div>
</div>


<div style="
overflow: auto;
	margin: auto;
" class="boxed long-text gutter">
	{#await data.post then post}
		<Markdown value={post} />
	{:catch error}
		<p style="color: var(--destructive);">Error: {error.message}</p>
	{/await}
</div>

<div id="Page_Check"></div>
