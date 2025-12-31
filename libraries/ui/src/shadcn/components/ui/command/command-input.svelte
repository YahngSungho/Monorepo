<script lang="ts">


import { css, cx } from '@emotion/css'
import { Command as CommandPrimitive } from 'bits-ui'
import IconText from '@library/ui/icon-text'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	value = $bindable(''),
	...restProps
}: CommandPrimitive.InputProps = $props()
</script>

<div class="flex h-9 items-center gap-2 border-b px-3" data-slot="command-input-wrapper">
	<IconText iconName="mdi:search" alone />
	<CommandPrimitive.Input
		class={cx(
			cn(
				`placeholder:text-muted-foreground outline-hidden flex h-10 w-full rounded-md bg-transparent py-3
				text-sm disabled:cursor-not-allowed disabled:opacity-50`,
				className,
			),
			css`
				border: none;
			`,
		)}
		data-slot="command-input"
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
