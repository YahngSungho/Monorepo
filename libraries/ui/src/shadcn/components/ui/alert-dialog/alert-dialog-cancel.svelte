<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

	import { buttonVariants } from "$shadcn/components/ui/button/index.js";
	import { cn } from "$shadcn/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogPrimitive.CancelProps = $props();
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: "outline" }), className)}
	data-slot="alert-dialog-cancel"
	bind:ref
	{...restProps}
/>
