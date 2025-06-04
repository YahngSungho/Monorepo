<script lang="ts">
import { css,cx } from '@emotion/css'
 import { R } from '@library/helpers/R'
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import { tick } from "svelte";

	import Button from "$daisy/button.svelte";
	import IconText from "$miscellaneous/icon-text/icon-text.svelte";
	import * as Command from "$shadcn/components/ui/command/index.js";
	import * as Popover from "$shadcn/components/ui/popover/index.js";

	import { allLanguages } from "./getAllLanguages.js";

	const { getLocale, setLocale } = $props()


	let open = $state(false);
	let value = $state(getLocale());
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(
		allLanguages.find((f) => f.value === value)?.label ?? value
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
 `}>
	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef}>
		 {#snippet child({ props })}
			<Button
			{...props}
			class={cx((typeof props.class === 'string' ? props.class : undefined), css`
			font-weight: normal;
			` )}
			aria-expanded={open}
			role="combobox"
			variant="text"
			>
			<IconText IconElement={ChevronsUpDownIcon} text={selectedValue || "Select a framework..."} />
			</Button>
		 {/snippet}
		</Popover.Trigger>
		<Popover.Content>
		 <Command.Root>
			<Command.Input placeholder="Search framework..." />
			<Command.List>
			 <Command.Empty>No framework found.</Command.Empty>
			 <Command.Group value="frameworks">
				{#each allLanguages as language (language.value)}
				 <Command.Item
					keywords={Object.values(R.omit('value')(language))}
					onSelect={() => {
					if (value !== language.value) {
						setLocale(language.value);
						value = language.value;
					}
					 closeAndFocusTrigger();
					}}
					value={language.value}
				 >
				 <IconText IconElement={value === language.value ? CheckIcon : null} text={language.label} />
				 </Command.Item>
				{/each}
			 </Command.Group>
			</Command.List>
		 </Command.Root>
		</Popover.Content>
	 </Popover.Root>
 </div>