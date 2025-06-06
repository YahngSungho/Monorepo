<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn, type WithoutChildrenOrChild } from '$shadcn/utils.js'

import * as RangeCalendar from './index.js'

let {
	ref = $bindable(null),
	value = $bindable(),
	placeholder = $bindable(),
	weekdayFormat = 'short',
	class: className,
	...restProps
}: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> = $props()
</script>

<RangeCalendarPrimitive.Root
	class={cn('p-3', className)}
	{weekdayFormat}
	bind:ref
	bind:value
	bind:placeholder
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header>
			<RangeCalendar.PrevButton />
			<RangeCalendar.Heading />
			<RangeCalendar.NextButton />
		</RangeCalendar.Header>
		<RangeCalendar.Months>
			{#each months as month (month)}
				<RangeCalendar.Grid>
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="flex">
							{#each weekdays as weekday (weekday)}
								<RangeCalendar.HeadCell>
									{weekday.slice(0, 2)}
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates (weekDates)}
							<RangeCalendar.GridRow class="mt-2 w-full">
								{#each weekDates as date (date)}
									<RangeCalendar.Cell {date} month={month.value}>
										<RangeCalendar.Day />
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</RangeCalendar.Months>
	{/snippet}
</RangeCalendarPrimitive.Root>
