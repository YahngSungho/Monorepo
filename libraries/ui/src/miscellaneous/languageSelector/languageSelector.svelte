<script lang="ts">
import { css } from '@emotion/css'
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import { tick } from "svelte";

	import { Button } from "$lib/components/ui/button/index.js";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { cn } from "$lib/utils.js";

	const frameworks = [
	 {
		value: "sveltekit",
		label: "SvelteKit"
	 },
	 {
		value: "next.js",
		label: "Next.js"
	 },
	 {
		value: "nuxt.js",
		label: "Nuxt.js"
	 },
	 {
		value: "remix",
		label: "Remix"
	 },
	 {
		value: "astro",
		label: "Astro"
	 }
	];

	let open = $state(false);
	let value = $state("");
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(
	 frameworks.find((f) => f.value === value)?.label
	);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	async function closeAndFocusTrigger() {
	 open = false;
	 await tick();
	 triggerRef.focus();
	}
 </script>

 <div class={css`
	inline-size: fit-content;
 `} data-name="루트">
	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef}>
		 {#snippet child({ props })}
			<Button
			class={css`
				inline-size: fit-content;
				justify-content: space-between;
			`}
			variant="outline"
			 {...props}
			 aria-expanded={open}
			 role="combobox"
			>
			 {selectedValue || "Select a framework..."}
			 <ChevronsUpDownIcon class="opacity-50" />
			</Button>
		 {/snippet}
		</Popover.Trigger>
		<Popover.Content class={css`
			inline-size: 100%;
			padding: 0;
		`}>
		 <Command.Root>
			<Command.Input placeholder="Search framework..." />
			<Command.List>
			 <Command.Empty>No framework found.</Command.Empty>
			 <Command.Group value="frameworks">
				{#each frameworks as framework (framework.value)}
				 <Command.Item
					onSelect={() => {
					 value = framework.value;
					 closeAndFocusTrigger();
					}}
					value={framework.value}
				 >
					<CheckIcon
					 class={cn(value !== framework.value && "text-transparent")}
					/>
					{framework.label}
				 </Command.Item>
				{/each}
			 </Command.Group>
			</Command.List>
		 </Command.Root>
		</Popover.Content>
	 </Popover.Root>
 </div>