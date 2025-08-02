<script>
import { mode, setMode } from 'mode-watcher'

let { size = 'sm' } = $props()
</script>

<label
	style="
border: 1px solid currentcolor;
"
	class={`toggle text-base-content toggle-${size}`}
>
	<input
		id="theme-controller"
		checked={mode.current === 'dark'}
		onchange={() => {
			setTimeout(() => {
				setMode(mode.current === 'light' ? 'dark' : 'light')
			}, 150)
		}}
		type="checkbox"
	/>

	<span style="inline-size: 24px; block-size: 24px;"
		><iconify-icon height="20" icon="mdi:white-balance-sunny" width="20"></iconify-icon></span
	>
	<span style="inline-size: 24px; block-size: 24px;"
		><iconify-icon height="20" icon="mdi:weather-night" width="20"></iconify-icon></span
	>
</label>
