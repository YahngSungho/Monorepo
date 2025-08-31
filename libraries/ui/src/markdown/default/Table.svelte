<script>
import { Table } from '$shadcn/components/ui/table/index'
let { children, ...rest } = $props()
</script>

<div class="myTable marginBlock-1">
	<Table {...rest}>{@render children()}</Table>
</div>

<style>
.myTable {
	inline-size: fit-content;
}
</style>
