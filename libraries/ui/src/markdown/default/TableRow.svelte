<script>
import { TableRow } from '$shadcn/components/ui/table/index'
let { children } = $props()
</script>

<TableRow>{@render children()}</TableRow>
