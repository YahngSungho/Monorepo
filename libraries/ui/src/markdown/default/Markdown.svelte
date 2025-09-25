<script>
import './style.css'

import { removeFrontmatter } from '@library/helpers/markdown'
import remarkBreaks from 'remark-breaks'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough'
import remarkCustomHeaderId from 'remark-custom-header-id'
import smartypants from 'remark-smartypants'
import { Markdown } from 'svelte-exmarkdown'
import { gfmPlugin } from 'svelte-exmarkdown/gfm'

import { rehypeRenameFootnotePrefix } from '../plugins/rehypeRenameFootnotePrefix'
import Blockquote from './Blockquote.svelte'
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
import WebImage from './WebImage.svelte'

let { plugins = [], value } = $props()
</script>

<Markdown
	md={removeFrontmatter(value)}
	plugins={[
		gfmPlugin(),
		{
			rehypePlugin: [rehypeRenameFootnotePrefix, 'note-'],
		},
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
			remarkPlugin: remarkCustomHeaderId,
		},
		{
			remarkPlugin: remarkBreaks,
		},
		{
			renderer: {
				webimage: WebImage,
			},
		},
		{
			renderer: {
				// text: Text, <- 안됨
				a: Link,
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
				li: ListItem,
				ol: OrderedList,
				p: Paragraph,
				pre: CodeBlock,
				strong: Strong,
				table: Table,
				tbody: TableBody,
				td: TableCell,
				th: TableHead,
				thead: TableHeader,
				tr: TableRow,
				ul: UnorderedList,
			},
		},
		...plugins,
	]}
/>
