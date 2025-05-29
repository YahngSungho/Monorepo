<script lang="ts">
 import { tick } from "svelte";
 import CaretSort from "svelte-radix/CaretSort.svelte";
 import Check from "svelte-radix/Check.svelte";

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

 let selectedValue = $derived(
  frameworks.find((f) => f.value === value)?.label ?? "Select a framework..."
 );

 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 async function closeAndFocusTrigger(triggerId: string) {
  open = false;
  await tick();
  (document.querySelector(`#${triggerId}`) as HTMLElement)?.focus();
 }
</script>

<Popover.Root bind:open let:ids>
 <Popover.Trigger asChild let:builder>
  <Button
   {...builder}
   class="w-[200px] justify-between"
   variant="outline"
  >
   {selectedValue}
   <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
 </Popover.Trigger>
 <!-- Todo: 브라우저 설정이랑 다르면 알리는 텍스트 -->
 <Popover.Content class="w-[200px] p-0">
  <Command.Root>
   <Command.Input class="h-9" placeholder="Search framework..." />
   <Command.Empty>No framework found.</Command.Empty>
   <Command.Group>
    {#each frameworks as framework (framework.value)}
     <Command.Item
      onSelect={() => {
       value = framework.value;
       closeAndFocusTrigger(ids.trigger);
      }}
      value={framework.value}
     >
      <Check
       class={cn(
        "mr-2 h-4 w-4",
        value !== framework.value && "text-transparent"
       )}
      />
      {framework.label}
     </Command.Item>
    {/each}
   </Command.Group>
  </Command.Root>
 </Popover.Content>
</Popover.Root>