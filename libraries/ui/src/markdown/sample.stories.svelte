<script module>
// JAVASCRIPT ONLY - NO lang="ts"
import { defineMeta } from '@storybook/addon-svelte-csf'

// MDSveX 파일을 Svelte 컴포넌트로 임포트합니다. MDSveX 전처리기가 변환을 처리합니다.
import SampleMdsvexComponent from './sample.svelte'

// defineMeta는 컴포넌트 메타데이터를 정의합니다.
const { Story } = defineMeta({
	// Storybook UI에서의 경로 및 컴포넌트 이름
	title: 'MDSveX',
	// MDSveX에 의해 처리된 컴포넌트
	// @ts-ignore
	component: SampleMdsvexComponent,
	parameters: {
		// 레이아웃을 조정하여 내용을 더 잘 볼 수 있도록 합니다 (선택 사항).
		layout: 'padded',
	},
	// sample.svx는 외부 props를 받지 않으므로 argTypes는 비워둡니다.
	argTypes: {},
})
</script>

<!--
이 .svx 파일은 자체 콘텐츠와 내부 상태를 가지고 있으므로,
복잡한 args나 공유 스니펫 없이 컴포넌트를 직접 렌더링하는 것이
MDSveX 통합을 테스트하는 가장 직접적인 방법입니다.
-->

<!-- 기본 렌더링 테스트 스토리 (Happy Path) -->
<Story
	name="DefaultRender"
	args={{
		// sample.svx는 외부로부터 args를 받지 않으므로 비워둡니다.
		// 이 컴포넌트는 frontmatter와 내부 Svelte 스크립트를 사용하여 자체 데이터를 관리합니다.
	}}
>
	<!-- 인라인 스니펫이나 정적 템플릿 없이 컴포넌트를 직접 렌더링합니다. -->
	<SampleMdsvexComponent />
</Story>

<!--
참고: generate-storybook.xml 프롬프트는 다양한 에지 케이스(부정적, 경계, 잘못된 입력 등)를 요구하지만,
sample.svx는 외부 props API를 통해 이러한 시나리오를 직접적으로 제어할 수 있도록 설계되지 않았습니다.
이 파일의 목적은 MDSveX 기능 자체를 시연하는 것이며, 기본 렌더링 스토리는
Storybook 환경 내에서 해당 기능이 작동하는지 확인하는 데 중점을 둡니다.
-->
