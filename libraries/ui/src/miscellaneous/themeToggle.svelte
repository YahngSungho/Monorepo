<script>
import MoonIcon from '@lucide/svelte/icons/moon'
import SunIcon from '@lucide/svelte/icons/sun'
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

	<SunIcon role="button" />
	<MoonIcon role="button" />
</label>
