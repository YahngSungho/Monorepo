<script>
import './style.css'

import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import smartypants from 'remark-smartypants'
import { Markdown } from 'svelte-exmarkdown'
import { gfmPlugin } from 'svelte-exmarkdown/gfm'

import Blockquote from './Blockquote.svelte'
import CloudinaryImage from './CloudinaryImage.svelte'
import CodeBlock from './CodeBlock.svelte'
import Delete from './Delete.svelte'
import Emphasis from './Emphasis.svelte'
import Heading1 from './Heading1.svelte'
import Heading2 from './Heading2.svelte'
import Heading3 from './Heading3.svelte'
import Heading4 from './Heading4.svelte'
import Heading5 from './Heading5.svelte'
import Heading6 from './Heading6.svelte'
import HorizontalRule from './HorizontalRule.svelte'
import Image from './Image.svelte'
import InlineCode from './InlineCode.svelte'
import Link from './Link.svelte'
import ListItem from './ListItem.svelte'
import OrderedList from './OrderedList.svelte'
import Paragraph from './Paragraph.svelte'
import Strong from './Strong.svelte'
import Table from './Table.svelte'
import TableBody from './TableBody.svelte'
import TableCell from './TableCell.svelte'
import TableHead from './TableHead.svelte'
import TableHeader from './TableHeader.svelte'
import TableRow from './TableRow.svelte'
import UnorderedList from './UnorderedList.svelte'

let { value, plugins = [] } = $props()
</script>

<div class="boxed">
	<Markdown
		md={value}
		plugins={[
			gfmPlugin(),
			{
				remarkPlugin: remarkCjkFriendly,
			},
			{
				remarkPlugin: remarkCjkFriendlyGfmStrikethrough,
			},
			{
				remarkPlugin: smartypants,
			},
			{
				renderer: {
					cloudinaryimage: CloudinaryImage,
				},
			},
			{
				renderer: {
					// text: Text, <- 안됨
					blockquote: Blockquote,
					code: InlineCode,
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
					a: Link,
					li: ListItem,
					ol: OrderedList,
					p: Paragraph,
					pre: CodeBlock,
					strong: Strong,
					table: Table,
					tbody: TableBody,
					td: TableCell,
					thead: TableHeader,
					th: TableHead,
					tr: TableRow,
					ul: UnorderedList,
				},
			},
			...plugins,
		]}
	/>
</div>
