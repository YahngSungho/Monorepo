<script>
// 테이블 셀은 align 속성을 가질 수 있습니다.
let { align = undefined, children } = $props()
</script>

<td {align}>{@render children()}</td>
