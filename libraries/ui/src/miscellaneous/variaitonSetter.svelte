<script>
	import { css } from '@emotion/css'

	import LanguageSelector from './languageSelector.svelte'
	import ThemeToggle from './themeToggle.svelte'

	const { getLocale, setLocale } = $props()

</script>

<div style="
display: flex;
flex-wrap: wrap;
align-items: end;
" class={css`
	& > * {
		margin-inline-end: -1px;
		margin-block-start: -1px;
		border-radius: 0 !important;
	}
`}>
	<ThemeToggle />
	<LanguageSelector buttonClass={css`
		border-radius: 0 !important;
			`} {getLocale} {setLocale} />
</div>
