<script>
let { children, ...restProps } = $props()
</script>

<blockquote {...restProps}>{@render children()}</blockquote>
