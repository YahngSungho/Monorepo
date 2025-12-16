<script>
let { children, ...rest } = $props()
import { balancer } from 'svelte-action-balancer'
</script>

<h5 use:balancer={{ enabled: true, ratio: 0.8 }} {...rest}>
	{@render children()}
</h5>
