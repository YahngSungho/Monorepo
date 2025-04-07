<script context="module">
// 각 마크다운 요소에 대응하는 컴포넌트들을 임포트하고 바로 내보냅니다.
// 경로는 실제 프로젝트 구조에 맞게 조정해야 할 수 있습니다.

// --- Heading Components ---
export { default as h1 } from './Heading1.svelte'
export { default as h2 } from './Heading2.svelte'
export { default as h3 } from './Heading3.svelte'
export { default as h4 } from './Heading4.svelte'
export { default as h5 } from './Heading5.svelte'
export { default as h6 } from './Heading6.svelte'
export { default as hr } from './HorizontalRule.svelte'
// --- Media Component ---
export { default as img } from './Image.svelte'
export { default as code } from './InlineCode.svelte' // 인라인 코드
// --- List Components ---
export { default as a } from './Link.svelte'
export { default as li } from './ListItem.svelte'
export { default as ol } from './OrderedList.svelte'
// --- Text Components ---
export { default as p } from './Paragraph.svelte'
export { default as strong } from './Strong.svelte'
// --- Table Components ---
export { default as pre } from './CodeBlock.svelte'
export { default as del } from './Delete.svelte'
export { default as em } from './Emphasis.svelte'
export { default as table } from './Table.svelte'
export { default as tbody } from './TableBody.svelte'
export { default as td } from './TableCell.svelte'
export { default as thead } from './TableHead.svelte'
export { default as th } from './TableHeader.svelte'
export { default as tr } from './TableRow.svelte'
export { default as ul } from './UnorderedList.svelte'
</script>
