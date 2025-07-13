<script>
let { children, ...rest } = $props()
</script>

<strong {...rest}>{@render children()}</strong>
