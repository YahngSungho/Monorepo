<script>
import { Table } from '$shadcn/components/ui/table/index'
let { children } = $props()
</script>

<div class="myTable">
	<Table>{@render children()}</Table>
</div>

<style>
.myTable {
	margin: var(--space-em-cqi-s-l);
}
</style>
