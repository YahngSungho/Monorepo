<script module>
	// 다양한 조합의 스토리를 작성합니다.
	// 각기 다른 happy path, edge case 및 가능한 모든 경우에 대한 스토리를 작성합니다.

	import { defineMeta } from '@storybook/addon-svelte-csf'
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './index'

	const { Story } = defineMeta({
		component: Accordion,
		tags: ['autodocs'],
	})
</script>

<Story name="기본 / 열림 상태">
	<Accordion>
		<AccordionItem>
			<AccordionTrigger>열기</AccordionTrigger>
			<AccordionContent>내용이 여기에 있습니다.</AccordionContent>
		</AccordionItem>
	</Accordion>
</Story>

<Story name="기본 / 닫힘 상태">
	<Accordion>
		<AccordionItem>
			<AccordionTrigger>닫기</AccordionTrigger>
			<AccordionContent>내용이 여기에 있습니다.</AccordionContent>
		</AccordionItem>
	</Accordion>
</Story>

<Story name="여러 항목">
	<Accordion>
		<AccordionItem>
			<AccordionTrigger>항목 1</AccordionTrigger>
			<AccordionContent>항목 1의 내용</AccordionContent>
		</AccordionItem>
		<AccordionItem>
			<AccordionTrigger>항목 2</AccordionTrigger>
			<AccordionContent>항목 2의 내용</AccordionContent>
		</AccordionItem>
	</Accordion>
</Story>

<Story name="여러 항목 / 일부 열림">
	<Accordion>
		<AccordionItem>
			<AccordionTrigger>항목 1</AccordionTrigger>
			<AccordionContent>항목 1의 내용</AccordionContent>
		</AccordionItem>
		<AccordionItem>
			<AccordionTrigger>항목 2</AccordionTrigger>
			<AccordionContent>항목 2의 내용</AccordionContent>
		</AccordionItem>
		<AccordionItem>
			<AccordionTrigger>항목 3</AccordionTrigger>
			<AccordionContent>항목 3의 내용</AccordionContent>
		</AccordionItem>
	</Accordion>
</Story>
