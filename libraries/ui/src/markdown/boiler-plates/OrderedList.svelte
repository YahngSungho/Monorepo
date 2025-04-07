<script>
// MDSvex는 'start' 속성을 전달할 수 있습니다.
let { start = undefined, children } = $props()
</script>

<ol {start}>{@render children()}</ol>
