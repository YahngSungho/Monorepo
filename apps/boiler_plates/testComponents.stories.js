import TestComponents from './testComponents.svelte'

export default {
	argTypes: {
		description: { control: 'text' },
		title: { control: 'text' },
	},
	component: TestComponents,
	tags: ['autodocs'],
	title: 'Components/TestComponents',
}

export const Default = {
	args: {
		description: '기본 설명',
		title: '기본 제목',
	},
}

export const LongTitle = {
	args: {
		description: '일반적인 설명',
		title: '이것은 매우 긴 제목입니다. 컴포넌트가 어떻게 처리하는지 확인해 보세요.',
	},
}

export const LongDescription = {
	args: {
		description: '이것은 매우 긴 설명입니다. 여러 줄에 걸쳐 표시될 수 있으며, 컴포넌트의 레이아웃에 어떤 영향을 미치는지 확인할 수 있습니다.',
		title: '일반 제목',
	},
}

export const EmptyTitle = {
	args: {
		description: '제목이 없는 경우의 설명',
		title: '',
	},
}

export const EmptyDescription = {
	args: {
		description: '',
		title: '설명이 없는 제목',
	},
}

export const HTMLContent = {
	args: {
		description: '<em>HTML 태그가 포함된 설명</em>',
		title: '<strong>HTML 태그가 포함된 제목</strong>',
	},
}

export const SpecialCharacters = {
	args: {
		description: '이모지 테스트: 😊🎉🚀',
		title: '특수문자 테스트: !@#$%^&*()',
	},
}

export const ExtremelyLongContent = {
	args: {
		description: '매우 긴 설명 '.repeat(100),
		title: '매우 긴 제목'.repeat(10),
	},
}
