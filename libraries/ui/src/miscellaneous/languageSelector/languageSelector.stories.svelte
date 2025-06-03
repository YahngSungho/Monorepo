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

<!--
  추가 설명:
  - 팝오버 열림, 언어 선택, 검색 등의 시나리오는 이 기본 스토리에서 사용자가 직접 컴포넌트와 상호작용하여 확인할 수 있습니다.
  - 'play' 함수가 금지되어 있어 해당 상태들을 코드를 통해 자동으로 설정하고 보여주는 것은 어렵습니다.

  - 데이터 변경이 필요한 시나리오 (예: 많은 아이템 목록, 빈 목록, 긴 텍스트 아이템 등)는
    현재 LanguageSelector 컴포넌트가 내부적으로 `frameworks` 데이터를 가지고 있기 때문에
    외부에서 Storybook args 등을 통해 직접 제어하기 어렵습니다.
  - 이러한 데이터 의존적인 시나리오들을 Storybook에서 효과적으로 테스트하고 시연하려면,
    LanguageSelector 컴포넌트가 `frameworks` 데이터를 prop으로 받도록 수정하는 것이 좋습니다.
    그렇게 수정된다면, 다양한 `frameworks` 데이터를 args로 전달하는 추가 스토리를 작성할 수 있습니다.

  현 지침 하에서는, 린트 오류 없이 컴포넌트의 기본 동작을 보여주는 단일 스토리를 제공합니다.
  이는 제공된 컴포넌트의 현재 구조와 Storybook 생성 규칙을 모두 만족시키는 현실적인 접근입니다.
-->
