<script>
import { css } from '@emotion/css'

import LanguageSelector from './languageSelector.svelte'
import ThemeToggle from './themeToggle.svelte'

let { getLocale, setLocale } = $props()
</script>

<div
	style="
align-items: end;
"
	class="boxed attached-group pyramid-wrap"
>
	<LanguageSelector
		buttonClass={css`
			border-radius: 0 !important;
		`}
		{getLocale}
		{setLocale}
	/>
	<ThemeToggle />
</div>
