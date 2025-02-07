<script>
import { Button } from '@repo/ui/button'
import { Badge } from '@repo/ui/badge'
import { Calendar } from '@repo/ui/calendar'
import Icon from '@repo/ui/icon'

const fo = 'bigCommandKEnabled'

let foo = $state(fo + ' foifoifo')

foo += ' bar133322222223'

const myObject = {
	bar: {
		deeplyNested: {
			inner: {
				moreInner: {
					evenMoreInner: {
						almostThere: {
							gettingDeeper: {
								bottle: 'done',
								deepestYet: {
									finalLevel: '이제 정말로 충분히 깊습니다.',
								},
							},
						},
					},
				},
			},
		},
		eo: 'vgf2',
		eov: 'fgv',
		wo: 'sw',
	},
	foo: 'bar',
	tor: 'boo',
}

;('') // eslint-disable-line sonarjs/no-unused-expressions
</script>

<h1 class={'bg-primary'}>Welcome to SvelteKit</h1>
<h2>Welcome to SvelteKit</h2>
<h3>Welcome to SvelteKit</h3>
<h4>Welcome to SvelteKit</h4>
<h5>Welcome to SvelteKit</h5>
<h6>Welcome to SvelteKit</h6>

<div>
	<Button variant={'default'}>안니옹하시오</Button>
	<Icon icon={'mdi:home'} style={'font-size: 2em;'}>My Icon</Icon>
	<div>
		<Icon icon={'mdi:home'} style={'font-size: 2em;'}>아이콘</Icon>
		{foo}
	</div>
</div>

<Calendar />

<p>
	<Badge>안니옹하시오</Badge>
</p>

<style>
p {
	max-inline-size: 1000px;
	background-color: var(--red-10);
}
</style>
