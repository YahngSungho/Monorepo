<script>
import { css } from '@emotion/css'

import LanguageSelector from './languageSelector.svelte'
import ThemeToggle from './themeToggle.svelte'

let { getLocale, setLocale, size = 'sm' } = $props()

let toggleSize = $derived.by(() => {
	if (size === 'sm') {
		return 'xl'
	}
	if (size === 'xs') {
		return 'md'
	}
	return size
})
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
		{size}
	/>
	<ThemeToggle size={toggleSize} />
</div>
