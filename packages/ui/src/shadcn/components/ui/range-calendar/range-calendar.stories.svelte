<script module>
// RangeCalendar 컴포넌트에 대한 Storybook 스토리 작성
import { defineMeta } from '@storybook/addon-svelte-csf'
import { getLocalTimeZone, today } from '@internationalized/date'
import {RangeCalendar} from './index.ts'

const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

let value = $state({
	end,
	start,
})

const { Story } = defineMeta({
	component: RangeCalendar,
	tags: ['autodocs'],
})

// 기본 스토리 설정
const defaultArgs = {
	placeholder: 'Select a date',
	weekdayFormat: 'short',
}

// 추가된 스토리: 다양한 날짜 범위 선택
const rangeArgs = {
	end: new Date(2023, 0, 7),
	start: new Date(2023, 0, 1),
}

</script>

<Story name='기본 / 날짜 선택'>
	<RangeCalendar bind:value />
</Story>

<Story name='날짜 범위 선택'>
	<RangeCalendar bind:value />
</Story>
