<script>
let { children, ...rest } = $props()
</script>

<del {...rest}>{@render children()}</del>
