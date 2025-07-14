<script lang="ts">
import { R } from '@library/helpers/R'
import { allLanguages } from '@library/paraglide/getAllActiveLanguageInfo'
import CheckIcon from '@lucide/svelte/icons/check'
import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'

import Button from '$daisy/button.svelte'
import * as Command from '$shadcn/components/ui/command/index.js'
import * as Popover from '$shadcn/components/ui/popover/index.js'

import IconText from './icon-text.svelte'

let { getLocale, setLocale, buttonClass = '' } = $props()

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
// 주요 언어 목록 (accept-language에 없는 언어들 사이의 순서 결정용)
// 영어, 스페인어, 중국어, 일본어, 힌디어, 포르투갈어, 러시아어, 독일어, 프랑스어, 한국어 순.
const MAJOR_LANGUAGES = ['en', 'es', 'zh', 'ja', 'hi', 'pt', 'ru', 'de', 'fr', 'ko']

const getLanguageRank = (lang: string): [number, number, number] => {
	const lang_lowerCase = lang.toLowerCase()
	const lang_primary = lang_lowerCase.split('-')[0]

	// 1순위: 브라우저 선호 언어와 일치하는 경우
	const exactMatchIndex = R.findIndex((preferred) => preferred.toLowerCase() === lang_lowerCase)(
		preferredLocales,
	)
	if (exactMatchIndex !== -1) {
		return [0, exactMatchIndex, 0] // [티어, 우선순위 인덱스, 타입: 완전 일치]
	}

	const prefixMatchIndex = R.findIndex(
		(preferred) => preferred.toLowerCase().split('-')[0] === lang_primary,
	)(preferredLocales)
	if (prefixMatchIndex !== -1) {
		return [0, prefixMatchIndex, 1] // [티어, 우선순위 인덱스, 타입: 부분 일치]
	}

	// 2순위: 주요 언어 목록에 포함되는 경우
	const majorLangIndex = R.indexOf(lang_lowerCase)(MAJOR_LANGUAGES)
	if (majorLangIndex !== -1) {
		return [1, majorLangIndex, 0] // [티어, 주요 언어 인덱스, 타입]
	}

	// 3순위: 그 외 언어
	return [2, 0, 0]
}

const allLanguages_sorted = Array.from(allLanguages).sort((a, b) => {
	const rankA = getLanguageRank(a.value)
	const rankB = getLanguageRank(b.value)

	// 티어 > 티어 내 인덱스 > 타입 순으로 비교
	if (rankA[0] !== rankB[0]) {
		return rankA[0] - rankB[0]
	}
	if (rankA[1] !== rankB[1]) {
		return rankA[1] - rankB[1]
	}
	return rankA[2] - rankB[2]
})
let open = $state(false)
let value = $state(getLocale())

const selectedValue = $derived(allLanguages_sorted.find((f) => f.value === value)?.label ?? value)

async function closeAndFocusTrigger() {
	open = false
}

const LOADING_VALUE = '$loading'
</script>

<div style="inline-size: fit-content;">
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					style="font-weight: normal;"
					class={buttonClass}
					aria-expanded={open}
					role="combobox"
					size="xs"
					variant="outline"
				>
					{#if value === LOADING_VALUE}
						<span style="margin-inline: 1em;" class="loading loading-dots loading-sm"></span>
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
