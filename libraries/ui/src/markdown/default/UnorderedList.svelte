<script>
let { children } = $props()
</script>

<ul class='ml-6 list-disc [&>li]:mt-2"'>{@render children()}</ul>
