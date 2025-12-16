<script>
import { mode, setMode } from 'mode-watcher'

let { size = 'sm' } = $props()

let checked = $derived(mode.current === 'dark')
</script>

<label
	style="
border: 1px solid currentcolor;
font-size: 1rem;
"
	class={`toggle text-base-content toggle-${size}`}
>
	<input
		id="theme-controller"
		{checked}
		onchange={() => {
			setTimeout(() => {
				setMode(mode.current === 'light' ? 'dark' : 'light')
			}, 150)
		}}
		type="checkbox"
	/>

	<span style="inline-size: 28px; block-size: 28px;"
		><iconify-icon height="20" icon="mdi:white-balance-sunny" width="20"></iconify-icon></span
	>
	<span style="inline-size: 28px; block-size: 28px;"
		><iconify-icon height="20" icon="mdi:weather-night" width="20"></iconify-icon></span
	>
</label>

<style>
.opacity-0 {
	opacity: 0 !important;
}
</style>
