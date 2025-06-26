<script>
import { Table } from '$shadcn/components/ui/table/index'
let { children, ...rest } = $props()
</script>

<div class="myTable">
	<Table {...rest}>{@render children()}</Table>
</div>

<style>
.myTable {
	inline-size: fit-content;
	margin: var(--space-em-cqi-xs-s);
	border: 2px solid var(--gray-12);
}
</style>
