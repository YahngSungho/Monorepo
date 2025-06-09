<script module>
// 자바스크립트 전용 - lang="ts" 사용 금지
// lucide-svelte에서 아이콘들을 가져옵니다.
import { Aperture, ExternalLink, Github, Link, Smile } from '@lucide/svelte'
import { defineMeta } from '@storybook/addon-svelte-csf'

import IconText from './icon-text.svelte'

// defineMeta는 컴포넌트 메타데이터를 정의합니다.
const { Story } = defineMeta({
	title: 'Miscellaneous/IconText', // Storybook에서의 경로 및 이름
	component: IconText,
	argTypes: {
		text: { control: 'text', description: '표시될 텍스트' },
		IconElement: { control: false, description: '표시될 아이콘 컴포넌트 (lucide-svelte)' },
		iconProps: { control: 'object', description: 'IconElement에 전달될 속성들' },
		right: { control: 'boolean', description: '아이콘을 오른쪽에 표시할지 여부' },
		noMargin: { control: 'boolean', description: '아이콘 주변 마진 제거 여부' },
		small: { control: 'boolean', description: '작은 크기로 표시할지 여부' },
		// ...restProps는 자동으로 처리되거나 필요시 명시할 수 있습니다.
	},
	// 모든 스토리에 대한 기본 args를 설정할 수 있습니다.
	args: {
		text: '샘플 텍스트',
		IconElement: Link, // 기본 아이콘
		iconProps: {},
		right: false,
		noMargin: false,
		small: false,
	},
})
</script>

<!-- 일관성을 위한 공유 스니펫 -->
{#snippet template(args)}
	<!-- 이 스니펫은 여러 스토리에서 재사용됩니다. -->
	<IconText {...args} />
{/snippet}

<!-- ✨ 일반 사용 사례 (HAPPY PATHS) -->
<Story name="기본_상태" args={{ text: 'Icon Text', IconElement: Link }} children={template} />

<Story
	name="아이콘_오른쪽_정렬"
	args={{
		text: '아이콘 오른쪽',
		IconElement: Aperture,
		right: true,
	}}
	children={template}
/>

<Story
	name="작은_크기_모드"
	args={{
		text: '작은 텍스트와 아이콘',
		IconElement: Smile,
		small: true,
	}}
	children={template}
/>

<Story
	name="아이콘_마진_제거"
	args={{
		text: '아이콘 마진 없음',
		IconElement: Github,
		noMargin: true,
	}}
	children={template}
/>

<Story
	name="아이콘만_표시"
	args={{
		text: undefined, // 텍스트 없음
		IconElement: Link,
	}}
	children={template}
/>

<Story
	name="다른_아이콘_사용 (Aperture)"
	args={{
		text: 'Aperture 아이콘',
		IconElement: Aperture,
	}}
	children={template}
/>

<Story
	name="아이콘_속성_전달 (strokeWidth)"
	args={{
		text: '굵은 아이콘',
		IconElement: Link,
		iconProps: { strokeWidth: 3, color: 'blue' },
	}}
	children={template}
/>

<Story
	name="추가_HTML_속성_전달 (id, class)"
	args={{
		text: 'ID와 클래스 적용',
		IconElement: Smile,
		id: 'custom-id',
		class: 'extra-class-on-span',
		style: 'background-color: #eee; padding: 5px;',
	}}
	children={template}
/>

<!-- ⚠️ 입력값 검증 및 경계 사례 (INVALID INPUT / BOUNDARY / EDGE CASES) -->
<Story
	name="텍스트_없음_null_입력"
	args={{
		text: undefined,
		IconElement: Link,
	}}
	children={template}
/>

<Story
	name="텍스트_없음_undefined_입력"
	args={{
		text: undefined, // args에 명시적으로 undefined를 넣거나, 아예 text prop을 생략할 수 있습니다.
		IconElement: Aperture,
	}}
	children={template}
/>

<Story
	name="모든_boolean_옵션_활성화"
	args={{
		text: '모든 옵션 활성화',
		IconElement: Smile,
		right: true,
		noMargin: true,
		small: true,
	}}
	children={template}
/>

<Story
	name="아이콘에_커스텀_클래스_전달"
	args={{
		text: '아이콘에 커스텀 클래스',
		IconElement: Github,
		iconProps: { class: 'blinking-icon special-svg-class' }, // iconProps를 통해 아이콘 내부 요소가 아닌 IconElement 컴포넌트에 클래스 전달
	}}
	children={template}
/>

<!-- 💪 스트레스 테스트 (STRESS TEST CASES) -->
<Story
	name="매우_긴_텍스트_입력"
	args={{
		text: `${'이것은 매우 긴 텍스트 문자열입니다. '.repeat(20)}이 문자열은 IconText 컴포넌트가 긴 내용을 어떻게 처리하는지, 예를 들어 줄 바꿈이나 오버플로우 관리를 테스트하기 위한 것입니다.`,
		IconElement: Link,
	}}
	children={template}
/>

<Story
	name="특수문자_및_HTML_포함_텍스트_입력"
	args={{
		text: '특수문자: !@#$%^&*()_+<>?:"{}|~` 그리고 <b>HTML 같은 태그</b> &amp; 엔티티 코드',
		IconElement: Aperture,
	}}
	children={template}
/>

<!-- 추가적인 스토리들 -->
<Story
	name="아이콘_색상_테스트_iconProps"
	args={{
		text: '색상 있는 아이콘',
		IconElement: Smile,
		iconProps: { color: 'green', strokeWidth: 1 }, // lucide 아이콘은 color prop으로 색상 변경
	}}
	children={template}
/>

<Story
	name="작고_오른쪽_마진없는_아이콘"
	args={{
		text: '작고 오른쪽, 마진 없음',
		IconElement: ExternalLink,
		small: true,
		right: true,
		noMargin: true,
	}}
	children={template}
/>
