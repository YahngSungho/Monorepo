<script lang="ts">
import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'

import { cn, type WithElementRef } from '$shadcn/utils'

type InputType = Exclude<HTMLInputTypeAttribute, 'file'>

type Props = WithElementRef<
	Omit<HTMLInputAttributes, 'type'> &
		({ files?: FileList; type: 'file' } | { files?: undefined; type?: InputType })
>

let {
	ref = $bindable(null),
	value = $bindable(),
	type,
	files = $bindable(),
	class: className,
	...restProps
}: Props = $props()
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		class={cn(
			`selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input
			ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0
			rounded-md border bg-transparent px-3 py-2 text-sm font-medium transition-[color,box-shadow]
			disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
			// 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
			// `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
			'aria-invalid:border-destructive',
			className,
		)}
		data-slot="input"
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		class={cn(
			`border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground
			ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0
			rounded-md border px-3 py-1 text-base transition-[color,box-shadow] disabled:cursor-not-allowed
			disabled:opacity-50 md:text-sm`,
			// 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
			// `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
			'aria-invalid:border-destructive',
			className,
		)}
		data-slot="input"
		{type}
		bind:value
		{...restProps}
	/>
{/if}
