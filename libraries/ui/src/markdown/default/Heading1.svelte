<script>
let { children, ...rest } = $props()
import { balancer } from 'svelte-action-balancer'
</script>

<h1 use:balancer={{ enabled: true, ratio: 0.8 }} {...rest}>
	{@render children()}
</h1>
