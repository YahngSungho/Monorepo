<script>
const { children, ...rest } = $props()
</script>

<em {...rest}>{@render children()}</em>
