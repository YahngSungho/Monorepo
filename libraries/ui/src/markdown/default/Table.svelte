<script>
import { Table } from '$shadcn/components/ui/table/index'
let { children } = $props()
</script>

<div class="myTable">
	<Table>{@render children()}</Table>
</div>

<style>
.myTable {
	inline-size: fit-content;
	margin: var(--space-em-cqi-xs-s);
	border: 2px solid var(--gray-12);
}
</style>
