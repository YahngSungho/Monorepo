<script>
import MoonIcon from '@lucide/svelte/icons/moon'
import SunIcon from '@lucide/svelte/icons/sun'
import { mode, setMode } from 'mode-watcher'

</script>

<label
	style="
border: 1px solid currentcolor;
color: var(--gray-8);
"
	class="toggle text-base-content"
>
	<input
		id="theme-controller"
		checked={mode.current === 'dark'}
		onchange={() => {
			setMode(mode.current === 'light' ? 'dark' : 'light')
		}}
		type="checkbox"
	/>

	<SunIcon role="button" />
	<MoonIcon role="button" />
</label>
