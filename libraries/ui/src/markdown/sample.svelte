<script>
	import { Markdown } from 'svelte-exmarkdown'

	// boiler-plates 컴포넌트 가져오기
	import Blockquote from './boiler-plates/Blockquote.svelte'
	import CodeBlock from './boiler-plates/CodeBlock.svelte'
	import Delete from './boiler-plates/Delete.svelte'
	import Emphasis from './boiler-plates/Emphasis.svelte'
	import Heading1 from './boiler-plates/Heading1.svelte'
	import Heading2 from './boiler-plates/Heading2.svelte'
	import Heading3 from './boiler-plates/Heading3.svelte'
	import Heading4 from './boiler-plates/Heading4.svelte'
	import Heading5 from './boiler-plates/Heading5.svelte'
	import Heading6 from './boiler-plates/Heading6.svelte'
	import HorizontalRule from './boiler-plates/HorizontalRule.svelte'
	import Image from './boiler-plates/Image.svelte'
	import InlineCode from './boiler-plates/InlineCode.svelte'
	import Link from './boiler-plates/Link.svelte'
	import ListItem from './boiler-plates/ListItem.svelte'
	import OrderedList from './boiler-plates/OrderedList.svelte'
	import Paragraph from './boiler-plates/Paragraph.svelte'
	import Strong from './boiler-plates/Strong.svelte'
	import Table from './boiler-plates/Table.svelte'
	import TableBody from './boiler-plates/TableBody.svelte'
	import TableCell from './boiler-plates/TableCell.svelte'
	import TableHead from './boiler-plates/TableHead.svelte'
	import TableHeader from './boiler-plates/TableHeader.svelte'
	import TableRow from './boiler-plates/TableRow.svelte'
	import UnorderedList from './boiler-plates/UnorderedList.svelte'
	import sampleText from './sample.md?raw'
	// MarkdownLayout은 레이아웃 용도로 보이며, 개별 요소 렌더러가 아니므로 제외합니다.

	const plugins = [
		{
			renderer: {
				blockquote: Blockquote,
				code: InlineCode, // 인라인 코드용
				del: Delete,
				em: Emphasis,
				h1: Heading1,
				h2: Heading2,
				h3: Heading3,
				h4: Heading4,
				h5: Heading5,
				h6: Heading6,
				hr: HorizontalRule,
				img: Image,
				a: Link, // 링크는 'a' 태그 사용
				li: ListItem,
				ol: OrderedList,
				p: Paragraph,
				pre: CodeBlock, // 코드 블록용
				strong: Strong,
				table: Table,
				tbody: TableBody,
				td: TableCell,
				thead: TableHead,
				th: TableHeader,
				tr: TableRow,
				ul: UnorderedList
			}
		}
	]
</script>

<Markdown md={sampleText} {plugins} />
