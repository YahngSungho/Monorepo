<script>
const { children, ...rest } = $props()
</script>

<tbody {...rest}>
	{@render children()}
</tbody>
