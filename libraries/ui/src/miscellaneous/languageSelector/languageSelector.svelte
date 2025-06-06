<script lang="ts">
import { css, cx } from '@emotion/css'
import { R } from '@library/helpers/R'
import { allLanguages } from '@library/paraglide/getAllActiveLanguageInfo'
import CheckIcon from '@lucide/svelte/icons/check'
import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'
import { tick } from 'svelte'

import Button from '$daisy/button.svelte'
import IconText from '$miscellaneous/icon-text/icon-text.svelte'
import * as Command from '$shadcn/components/ui/command/index.js'
import * as Popover from '$shadcn/components/ui/popover/index.js'

const { getLocale, setLocale } = $props()

const preferredLocales = (() => {
	if (typeof navigator !== 'undefined') {
		if (navigator.languages && navigator.languages.length > 0) {
			return navigator.languages
		}
		if (navigator.language) {
			return [navigator.language]
		}
	}
	return [] as readonly string[]
})()

const allLanguages_sorted = Array.from(allLanguages).sort((a, b) => {
	const langA = a.value
	const langB = b.value

	let indexA = -1
	for (const [i, preferredLocale] of preferredLocales.entries()) {
		if (preferredLocale.startsWith(langA)) {
			indexA = i
			break
		}
	}

	let indexB = -1
	for (const [i, preferredLocale] of preferredLocales.entries()) {
		if (preferredLocale.startsWith(langB)) {
			indexB = i
			break
		}
	}

	const aIsPreferred = indexA !== -1
	const bIsPreferred = indexB !== -1

	if (aIsPreferred && bIsPreferred) {
		return indexA - indexB
	} else if (aIsPreferred) {
		return -1
	} else if (bIsPreferred) {
		return 1
	}
	return 0
})

let open = $state(false)
let value = $state(getLocale())
let triggerRef = $state<HTMLButtonElement>(null!)

const selectedValue = $derived(allLanguages_sorted.find((f) => f.value === value)?.label ?? value)

// We want to refocus the trigger button when the user selects
// an item from the list so users can continue navigating the
// rest of the form with the keyboard.
async function closeAndFocusTrigger() {
	open = false
	await tick()
	triggerRef.focus()
}

const LOADING_VALUE = '$loading'
</script>

<div
	class={css`
		inline-size: fit-content;
	`}
>
	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef}>
			{#snippet child({ props })}
				<Button
					{...props}
					class={cx(
						typeof props.class === 'string' ? props.class : undefined,
						css`
							font-weight: normal;
						`,
					)}
					aria-expanded={open}
					role="combobox"
					variant="text"
					size="xs"
				>
					{#if value === LOADING_VALUE}
						<span
							class={cx(
								'loading loading-dots loading-sm',
								css`
									margin-inline: 1em;
								`,
							)}
						></span>
					{:else}
						<IconText
							IconElement={ChevronsUpDownIcon}
							text={selectedValue || 'Select a framework...'}
						/>
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content>
			<Command.Root>
				<Command.Input placeholder="Search framework..." />
				<Command.List>
					<Command.Empty>No framework found.</Command.Empty>
					<Command.Group value="frameworks">
						{#each allLanguages_sorted as language (language.value)}
							<Command.Item
								keywords={Object.values(R.omit('value')(language))}
								onSelect={() => {
									if (value !== language.value) {
										setLocale(language.value)
										value = LOADING_VALUE
									}
									closeAndFocusTrigger()
								}}
								value={language.value}
							>
								<IconText
									IconElement={value === language.value ? CheckIcon : null}
									text={language.label}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>
