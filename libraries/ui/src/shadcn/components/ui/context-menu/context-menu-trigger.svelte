<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: ContextMenuPrimitive.TriggerProps = $props();
</script>

<ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" bind:ref {...restProps} />
