<script module>
// 모든 가능한 args 조합에 대한 스토리 작성
import { defineMeta } from '@storybook/addon-svelte-csf'
import Badge from './badge.svelte'

const { Story } = defineMeta({
	component: Badge,
	tags: ['autodocs'],
})

// 다양한 variant 세트 정의
const argSet1 = {
	variant: 'default',
}
const argSet2 = {
	variant: 'secondary',
}
const argSet3 = {
	variant: 'destructive',
}
const argSet4 = {
	variant: 'outline',
}

</script>

<Story name='Default Badge'>
	<Badge {...argSet1}>Default Badge</Badge>
</Story>

<Story name='Secondary Badge'>
	<Badge {...argSet2}>Secondary Badge</Badge>
</Story>

<Story name='Destructive Badge'>
	<Badge {...argSet3}>Destructive Badge</Badge>
</Story>

<Story name='Outline Badge'>
	<Badge {...argSet4}>Outline Badge</Badge>
</Story>
