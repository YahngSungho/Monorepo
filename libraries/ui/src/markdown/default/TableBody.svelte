<script>
import { TableBody } from '$shadcn/components/ui/table/index'
let { children } = $props()
</script>

<TableBody>{@render children()}</TableBody>
