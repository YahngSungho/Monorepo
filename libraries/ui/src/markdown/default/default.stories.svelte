<script module>
// @ts-nocheck
// JAVASCRIPT ONLY - NO lang="ts"
import { defineMeta } from '@storybook/addon-svelte-csf'

import Markdown from './Markdown.svelte'
import sampleText from './sample.md?raw'


const { Story } = defineMeta({
	component: Markdown,
	title: 'Markdown/Default',
	parameters: {
		// 레이아웃을 조정하여 내용을 더 잘 볼 수 있도록 합니다 (선택 사항).
		layout: 'padded',
	},
})
</script>

<!-- 기본 렌더링 테스트 스토리 (Happy Path) -->
<Story name="DefaultRender" asChild>
	<div class="story-container boxed">
		<Markdown value={sampleText} />
	</div>
</Story>

<style>
.story-container {
	max-inline-size: var(--size-content-4);
	margin: auto;
}
</style>
