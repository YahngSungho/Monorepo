<script module>
// @ts-nocheck
// 자바스크립트 전용 - lang="ts" 사용 금지
import { defineMeta } from '@storybook/addon-svelte-csf'
import IconText from './icon-text.svelte'
import StorybookDecorator from '@library/ui/storybookDecorator'

// 메타데이터 정의: 컴포넌트, 경로(사이드바), 전역 데코레이터, 컨트롤 설정
const { Story } = defineMeta({
	title: 'Miscellaneous/IconText',
	component: IconText,
	    decorators: [
      (StoryElement) => ({
        Component: StorybookDecorator,
        props: { children: StoryElement },
      }),
    ],
	argTypes: {
		text: { control: 'text', description: '텍스트 콘텐츠' },
		iconName: { control: 'text', description: 'Iconify 아이콘 이름' },
		iconProps: { control: 'object', description: 'Iconify 아이콘에 전달할 속성' },
		right: { control: 'boolean', description: '아이콘을 오른쪽에 배치' },
		noMargin: { control: 'boolean', description: '아이콘 좌우 여백 제거' },
		small: { control: 'boolean', description: '작은 아이콘 크기' },
		alone: { control: 'boolean', description: '텍스트/children 없이 아이콘만 표시' },
		class: { control: 'text', description: '추가 클래스' },
	},
})
</script>

<!-- 공유 스니펫: args를 그대로 IconText에 전달 -->
{#snippet template(args)}
	<IconText {...args} />
{/snippet}

<!-- 1) 해피 패스: 기본 텍스트 + 왼쪽 아이콘 -->
<Story name="기본:왼쪽아이콘" args={{ text: '저장', iconName: 'mdi:content-save' }} {template} />

<!-- 2) 해피 패스: 오른쪽 아이콘 -->
<Story name="기본:오른쪽아이콘" args={{ text: '다음', iconName: 'mdi:chevron-right', right: true }} {template} />

<!-- 3) 해피 패스: children 사용(슬롯) -->
<Story name="children_슬롯_사용">
	{#snippet template()}
		<IconText iconName="mdi:star">
			{#snippet children()}
				<strong>즐겨찾기</strong>
			{/snippet}
		</IconText>
	{/snippet}
</Story>

<!-- 4) 경계값: 빈 문자열 텍스트 + 아이콘(아이콘만 모드 유도 아님) -->
<Story name="경계값:빈텍스트_아이콘존재" args={{ text: '', iconName: 'mdi:eye' }} {template} />

<!-- 5) 경계값: 매우 긴 텍스트(스트레스도 겸함) -->
<Story name="경계값:매우긴텍스트" args={{ text: '긴 텍스트 '.repeat(100), iconName: 'mdi:text-long' }} {template} />

<!-- 6) 엣지: alone=true로 아이콘만 표시 (children/text 없음) -->
<Story name="엣지:아이콘만_alone" args={{ alone: true, iconName: 'mdi:information-outline' }} {template} />

<!-- 7) 엣지: noMargin=true 여백 제거 -->
<Story name="엣지:noMargin_적용" args={{ text: '연결', iconName: 'mdi:link-variant', noMargin: true }} {template} />

<!-- 8) 엣지: small=true 작은 아이콘 크기 -->
<Story name="엣지:small_아이콘" args={{ text: '작게', iconName: 'mdi:minus-circle-outline', small: true }} {template} />

<!-- 9) 잘못된 입력: iconName 잘못된값(렌더 안전성 확인) -->
<Story name="잘못된입력:아이콘이름_무효" args={{ text: '아이콘 없음', iconName: 'mdi:__invalid__' }} {template} />

<!-- 10) 잘못된 입력: iconProps에 잘못된 타입(문자열) 전달 -->
<Story name="잘못된입력:iconProps_문자열" args={{ text: '속성 오류', iconName: 'mdi:alert', iconProps: 'not-an-object' }} {template} />

<!-- 11) 잘못된 입력: text에 숫자 전달 -->
<Story name="잘못된입력:text_숫자" args={{ text: 12345, iconName: 'mdi:numeric' }} {template} />

<!-- 12) 스트레스: iconProps로 크기/색 등 대량 속성 전달 -->
<Story name="스트레스:iconProps_대량속성" args={{
	text: '풍부한 속성',
	iconName: 'mdi:tune',
	iconProps: {
		width: 48,
		height: 48,
		inline: true,
		rotate: 2,
		flip: 'horizontal,vertical',
		color: 'rebeccapurple',
		style: 'filter: drop-shadow(0 0 6px rgba(0,0,0,.3));',
		// class: 'custom-icon-class'
	}
}} {template} />

<!-- 13) 레이아웃/RTL 유사 확인: 오른쪽 정렬 + 긴 텍스트 조합 -->
<Story name="레이아웃:RTL_유사_오른쪽아이콘_긴텍스트" args={{ right: true, text: 'RTL/오른쪽 배치 확인 '.repeat(20), iconName: 'mdi:format-textdirection-r-to-l' }} {template} />

<!-- 14) 클래스 전달 확인: class로 외부 클래스 전달 -->
<!-- <Story name="클래스전달:추가기능" args={{ text: '클래스 적용', iconName: 'mdi:brush', class: 'external-class' }} {template} /> -->

<!-- 15) children + right 조합(아이콘 오른쪽, children 존재) -->
<Story name="조합:children_오른쪽아이콘">
	{#snippet template()}
		<IconText right iconName="mdi:arrow-right">
			{#snippet children()}
				<i>다음 단계</i>
			{/snippet}
		</IconText>
	{/snippet}
</Story>
