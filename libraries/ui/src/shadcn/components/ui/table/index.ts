import Root from "./table.svelte";
import Footer from "./table-footer.svelte";
import Head from "./table-head.svelte";
import Header from "./table-header.svelte";
import Row from "./table-row.svelte";

export {
	Footer,
	Head,
	Header,
	Root,
	Row,
	//
	Root as Table,
	Footer as TableFooter,
	Head as TableHead,
	Header as TableHeader,
	Row as TableRow,
};

export {default as Body, default as TableBody} from "./table-body.svelte";
export {default as Caption, default as TableCaption} from "./table-caption.svelte";
export {default as Cell, default as TableCell} from "./table-cell.svelte";