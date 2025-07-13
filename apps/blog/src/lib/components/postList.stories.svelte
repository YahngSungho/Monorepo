<script module>
import StorybookDecorator from '@library/ui/storybookDecorator'
import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'

import PostList from './postList.svelte'

const { Story } = defineMeta({
	title: 'blog/PostList',
	component: PostList,
	decorators: [() => StorybookDecorator],
})
</script>

<script>
setTemplate(template)

const stressPosts = Array.from({ length: 100 }, (_, i) => ({
	slug: `post-${i + 1}`,
	title: `스트레스 테스트 게시물 ${i + 1}`,
	current: i === 50,
	visited: i < 20,
}))
</script>

{#snippet template(args)}
	<PostList {...args} />
{/snippet}

<!-- ==================== Happy Paths ==================== -->
<Story
	name="기본 상태"
	args={{
		postMetadata: [
			{ slug: 'post-1', title: '첫 번째 게시물', current: false, visited: true },
			{ slug: 'post-2', title: '두 번째 게시물 (활성)', current: true, visited: false },
			{ slug: 'post-3', title: '세 번째 게시물', current: false, visited: false },
		],
	}}
/>

<Story
	name="모두 방문한 상태"
	args={{
		postMetadata: [
			{ slug: 'post-1', title: '첫 번째 게시물', current: false, visited: true },
			{ slug: 'post-2', title: '두 번째 게시물 (활성)', current: true, visited: true },
			{ slug: 'post-3', title: '세 번째 게시물', current: false, visited: true },
		],
	}}
/>

<Story
	name="아무것도 방문하지 않은 상태"
	args={{
		postMetadata: [
			{ slug: 'post-1', title: '첫 번째 게시물', current: false, visited: false },
			{ slug: 'post-2', title: '두 번째 게시물 (활성)', current: true, visited: false },
			{ slug: 'post-3', title: '세 번째 게시물', current: false, visited: false },
		],
	}}
/>

<Story
	name="하나의 게시물만 있는 경우"
	args={{
		postMetadata: [{ slug: 'single-post', title: '유일한 게시물', current: true, visited: false }],
	}}
/>

<!-- ==================== Negative Paths ==================== -->

<Story
	name="필수 필드 누락"
	args={{
		postMetadata: [
			{ slug: 'post-1', current: false, visited: true }, // title 누락
			{ title: '두 번째 게시물', current: true, visited: false }, // slug 누락
			{ slug: 'post-3', title: '세 번째 게시물', current: false, visited: true, extraProp: 'test' },
		],
	}}
/>

<!-- ==================== Boundary Value Cases ==================== -->

<Story name="빈 목록" args={{ postMetadata: [] }} />

<!-- ==================== Edge Cases ==================== -->

<Story
	name="긴 제목"
	args={{
		postMetadata: [
			{
				slug: 'long-title',
				title:
					'이것은 컴포넌트가 긴 제목을 어떻게 처리하는지 확인하기 위한 아주 아주 아주 아주 아주 아주 아주 긴 제목입니다. 래핑이 되거나 잘리거나 해야 합니다. 이것은 컴포넌트가 긴 제목을 어떻게 처리하는지 확인하기 위한 아주 아주 아주 아주 아주 아주 아주 긴 제목입니다. 래핑이 되거나 잘리거나 해야 합니다. 이것은 컴포넌트가 긴 제목을 어떻게 처리하는지 확인하기 위한 아주 아주 아주 아주 아주 아주 아주 긴 제목입니다. 래핑이 되거나 잘리거나 해야 합니다.',
				current: true,
				visited: false,
			},
			{ slug: 'short-title', title: '짧은 제목', current: false, visited: false },
		],
	}}
/>

<Story
	name="특수 문자가 포함된 제목"
	args={{
		postMetadata: [
			{
				slug: 'special-chars',
				title: '제목 "특수문자" & <테스트> \'포함\'',
				current: true,
				visited: false,
			},
		],
	}}
/>

<Story
	name="활성 & 방문 동시 상태"
	args={{
		postMetadata: [
			{ slug: 'post-1', title: '방문함', current: false, visited: true },
			{ slug: 'post-2', title: '활성 & 방문함', current: true, visited: true },
			{ slug: 'post-3', title: '기본', current: false, visited: false },
		],
	}}
/>

<!-- ==================== Stress Test Cases ==================== -->
<Story name="많은 게시물 (100개)" args={{ postMetadata: stressPosts }} />

<Story
	name="중복된 슬러그"
	args={{
		postMetadata: [
			{ slug: 'post-1', title: '첫 번째 게시물 (슬러그 중복)', current: false, visited: true },
			{ slug: 'post-1', title: '두 번째 게시물 (슬러그 중복)', current: true, visited: false },
			{ slug: 'post-3', title: '세 번째 게시물', current: false, visited: false },
		],
	}}
/>
