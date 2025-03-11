<script lang="ts">
import { mode } from 'mode-watcher'
import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner'

let restProps: SonnerProps = $props()
</script>

<Sonner
	class="toaster group"
	theme={$mode}
	toastOptions={{
		classes: {
			actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
			cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
			description: 'group-[.toast]:text-muted-foreground',
			toast:
				'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
		},
	}}
	{...restProps}
/>
