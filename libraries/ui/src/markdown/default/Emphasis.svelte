<script>
let { children, ...rest } = $props()
</script>

<em {...rest}>{@render children()}</em>
