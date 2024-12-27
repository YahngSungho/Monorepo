<!-- Fix 임시방편 / Storybook에서 svelte 5 comp의 children를 사용할 수 없는 문제 해결 -->
<script>
const { children, Component, ...restProps } = $props();

''; // eslint-disable-line sonarjs/no-unused-expressions
</script>

<!-- svelte-ignore svelte_component_deprecated -->
<Component {...restProps} >
    {#if children}
        {@render children()}
    {/if}
</Component>