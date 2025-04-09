<script>
let { start = undefined, children } = $props()
</script>

<ol class="ml-6 list-decimal [&>li]:mt-2" {start}>{@render children()}</ol>
