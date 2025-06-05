<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import LanguageSelector from './languageSelector.svelte';

  // 컴포넌트 메타데이터 정의
  const { Story } = defineMeta({
    title: 'Miscellaneous/LanguageSelector',
    component: LanguageSelector,
    // argTypes와 args를 사용한 props 전달을 제거하여 타입 오류를 방지합니다.
    // 각 스토리는 컴포넌트의 기본 렌더링을 보여줍니다.
  });
</script>

<!--
  이 스니펫은 모든 스토리에 사용됩니다.
  컴포넌트의 기본 렌더링을 보여주고, 사용자가 직접 상호작용하여 기능을 테스트할 수 있도록 합니다.
-->
{#snippet default_template_snippet()}
<div style:min-height="300px" style:padding="20px">
	<LanguageSelector getLocale={() => "언어"} setLocale={() => {}} />
</div>
{/snippet}


<!-- 1. 기본 상태 (해피 패스) -->
<!-- 설명: 컴포넌트의 기본 렌더링 상태입니다. 사용자가 직접 상호작용하여 기능을 테스트할 수 있습니다. -->
<Story name="기본_상태_및_일반_동작" children={default_template_snippet} />
