import Root from "./pagination.svelte";
import Link from "./pagination-link.svelte";
import NextButton from "./pagination-next-button.svelte";
import PrevButton from "./pagination-prev-button.svelte";

export {
	Link,
	NextButton,
	//
	Root as Pagination,
	Link as PaginationLink,
	NextButton as PaginationNextButton,
	PrevButton as PaginationPrevButton,
	PrevButton,
	Root,
};

export {default as Content, default as PaginationContent} from "./pagination-content.svelte";
export {default as Ellipsis, default as PaginationEllipsis} from "./pagination-ellipsis.svelte";
export {default as Item, default as PaginationItem} from "./pagination-item.svelte";