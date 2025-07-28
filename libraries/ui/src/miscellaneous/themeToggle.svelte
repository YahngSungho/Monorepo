<script>
import { mode, setMode } from 'mode-watcher'

import IconText from './icon-text.svelte'

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

	<iconify-icon icon="mdi:white-balance-sunny"></iconify-icon>
	<iconify-icon icon="mdi:weather-night"></iconify-icon>
</label>
