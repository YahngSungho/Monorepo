<script lang="ts">
 import CheckIcon from "@lucide/svelte/icons/check";
 import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
 import { tick } from "svelte";

 import { Button } from "$lib/components/ui/button/index.js";
 import * as Command from "$lib/components/ui/command/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 import { cn } from "$lib/utils.js";

 const frameworks = [
  {
   value: "ko",
   label: "한국어"
  },
  {
   value: "en",
   label: "영어"
  },
  {
   value: "ja",
   label: "일본어"
  },
  {
   value: "zh",
   label: "중국어"
  },
  {
   value: "vi",
   label: "베트남어"
  }
 ];

 let open = $state(false);
 let value = $state("");
 let triggerRef = $state<HTMLButtonElement | null>(null);

 const selectedValue = $derived(
  frameworks.find((f) => f.value === value)?.label
 );

 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 async function closeAndFocusTrigger() {
  open = false;
  await tick();
  triggerRef?.focus();
 }
</script>

<Popover.Root bind:open>
 <Popover.Trigger>
  {#snippet child({ props })}
   <Button
	 class="w-[200px] justify-between"
    variant="outline"
    bind:ref={triggerRef}
    {...props}
    aria-expanded={open}
    role="combobox"
   >
    {selectedValue || "Select a framework..."}
    <ChevronsUpDownIcon class="opacity-50" />
   </Button>
  {/snippet}
 </Popover.Trigger>
 <Popover.Content class="w-[200px] p-0">
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