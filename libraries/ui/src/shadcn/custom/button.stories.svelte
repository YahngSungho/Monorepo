<script module>
// 모든 가능한 args 조합에 대한 스토리를 작성합니다.
// 각기 다른 행복한 경로, 엣지 케이스 및 모든 가능한 경우에 대한 스토리를 작성합니다.

import { defineMeta } from '@storybook/addon-svelte-csf'
import Button from './button.svelte'

const { Story } = defineMeta({
	component: Button,
	tags: ['autodocs'],
})

// 기본 및 변형 세트 정의
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
	variant: 'ghost',
}
const argSet5 = {
	variant: 'link',
}
const argSet6 = {
	variant: 'outline',
}
</script>

<Story name="Default / Small">
	<Button size="sm" {...argSet1}>Small Default Button</Button>
</Story>

<Story name="Default / Large">
	<Button size="lg" {...argSet1}>Large Default Button</Button>
</Story>

<Story name="Secondary / Small">
	<Button size="sm" {...argSet2}>Small Secondary Button</Button>
</Story>

<Story name="Secondary / Large">
	<Button size="lg" {...argSet2}>Large Secondary Button</Button>
</Story>

<Story name="Destructive / Small">
	<Button size="sm" {...argSet3}>Small Destructive Button</Button>
</Story>

<Story name="Destructive / Large">
	<Button size="lg" {...argSet3}>Large Destructive Button</Button>
</Story>

<Story name="Ghost / Small">
	<Button size="sm" {...argSet4}>Small Ghost Button</Button>
</Story>

<Story name="Ghost / Large">
	<Button size="lg" {...argSet4}>Large Ghost Button</Button>
</Story>

<Story name="Link / Small">
	<Button size="sm" {...argSet5}>Small Link Button</Button>
</Story>

<Story name="Link / Large">
	<Button size="lg" {...argSet5}>Large Link Button</Button>
</Story>

<Story name="Outline / Small">
	<Button size="sm" {...argSet6}>Small Outline Button</Button>
</Story>

<Story name="Outline / Large">
	<Button size="lg" {...argSet6}>Large Outline Button</Button>
</Story>

<Story name="DaisiUI Buttons">
	<button class="btn btn-primary">Primary</button>
	<button class="btn btn-secondary">Secondary</button>
	<button class="btn btn-accent">Accent</button>
	<button class="btn btn-neutral">Neutral</button>
	<button class="btn btn-info">Info</button>
	<button class="btn btn-success">Success</button>
	<button class="btn btn-warning">Warning</button>
	<button class="btn btn-error">Error</button>
</Story>
