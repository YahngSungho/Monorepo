<script>
let { children, ...rest } = $props()
import { balancer } from 'svelte-action-balancer'
</script>

<h3 use:balancer={{ enabled: true, ratio: 0.7 }} {...rest}>
	{@render children()}
</h3>
