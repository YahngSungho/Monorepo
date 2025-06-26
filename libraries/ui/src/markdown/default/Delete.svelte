<script>
const { children, ...rest } = $props()
</script>

<del {...rest}>{@render children()}</del>
