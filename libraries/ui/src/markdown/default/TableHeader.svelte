<script>
// 테이블 헤더는 align 속성을 가질 수 있습니다.
let { align = undefined, children } = $props()
</script>

<th {align}>{@render children()}</th>
