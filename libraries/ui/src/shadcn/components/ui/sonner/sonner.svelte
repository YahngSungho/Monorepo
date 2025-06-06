<script lang="ts">
import { mode } from 'mode-watcher'
import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner'

let { ...restProps }: SonnerProps = $props()
</script>

<Sonner
	style="
	--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border);

	font-family: inherit !important;
	"
	class="toaster group"
	theme={mode.current}
	{...restProps}
/>
