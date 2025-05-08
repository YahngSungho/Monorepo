// import { google } from '@ai-sdk/google'
import { readFileFromRelativePath } from '@library/helpers/fs-async'
import { validateNumbers } from '@library/helpers/helper-functions'
import { R } from '@library/helpers/R'
import { generateObjectWithRetry } from '@library/llms/gemini/generate'
import { getCachedModel } from '@library/llms/gemini/getModel'
import { config } from 'dotenv'
import { z } from 'zod'


const readPrompt = readFileFromRelativePath(import.meta.url)

const promptForParaglide = await readPrompt('./paraglide/prompt.md')
const promptForMarkdown = await readPrompt('./markdown/prompt.md')

config({ path: '../../.env' })

// const model = google('gemini-2.5-pro-exp-03-25', {
// structuredOutputs: false,
// })
const getTheModel = getCachedModel('gemini-2.5-pro-exp-03-25', {
structuredOutputs: false,
})
const modelForParaglide = await getTheModel(promptForParaglide)
const modelForMarkdown = await getTheModel(promptForMarkdown)

export const generateTranslation_paraglide = async (language, targetMessages, olderMessages, dictionary) => {
	const target = `

	---

	<REQUEST>
		<TARGET LANGUAGE>
			${JSON.stringify(language)}
		</TARGET LANGUAGE>
		<OLDER MESSAGES>
			${JSON.stringify(olderMessages)}
		</OLDER MESSAGES>
		<DICTIONARY>
			${JSON.stringify(dictionary)}
		</DICTIONARY>
		<TARGET MESSAGES>
			${JSON.stringify(targetMessages)}
		</TARGET MESSAGES>
	</REQUEST>
	`

		// Paraglide 변형 객체 (매칭 또는 복수형)에 대한 기본 스키마
	const ParaglideVariantSchema = z.object({
		match: z.record(z.string(), z.string()), // match는 필수
		declarations: z.array(z.string()).optional(), // declarations는 선택적
		selectors: z.array(z.string()).optional(), // selectors는 선택적
	}).passthrough() // 다른 잠재적 키 허용 (유연성 위해)

	// 스키마 정의
	const schema = z.object({
		planForSubtleParts: z.array(
			z.object({
				part: z.string(),
				why: z.string(),
				plan: z.string(),
			}),
		),
		translatedMessages: z.record(
			z.string(),
			z.union([
				z.string(),
				ParaglideVariantSchema,
			]),
		).refine(validateNumbers(targetMessages), {
			message: "TranslatedMessages keys must be sequential positive integer strings starting from '1'",
			// path: ['translatedMessages'] // 필요시 에러 경로 지정
		}),
		newDictionary: z.record(z.string(), z.string()), // 키: 원본 용어, 값: 번역된 용어
	})

	const object = await generateObjectWithRetry({
		// model,
		schema,
		// prompt: promptForParaglide + target,
		model: modelForParaglide,
		prompt: target,
	})

	return object
}

export const generateTranslation_markdown = async (language, targetMessages, olderMessages, dictionary) => {
	const target = `

	---

	<REQUEST>
		<TARGET LANGUAGE>
			${JSON.stringify(language)}
		</TARGET LANGUAGE>
		<OLDER MESSAGES>
			${JSON.stringify(olderMessages)}
		</OLDER MESSAGES>
		<DICTIONARY>
			${JSON.stringify(dictionary)}
		</DICTIONARY>
		<TARGET MESSAGES>
			${JSON.stringify(targetMessages)}
		</TARGET MESSAGES>
	</REQUEST>
	`

	// 스키마 정의
	const schema = z.object({
		planForSubtleParts: z.array(
			z.object({
				part: z.string(),
				why: z.string(),
				plan: z.string(),
			}),
		),
		translatedMessages: z.record(
			z.string(),
			z.string(),
		).refine(validateNumbers(targetMessages), {
			message: "TranslatedMessages keys must be sequential positive integer strings starting from '1'",
			// path: ['translatedMessages'] // 필요시 에러 경로 지정
		}),
		newDictionary: z.record(z.string(), z.string()), // 키: 원본 용어, 값: 번역된 용어
	})

	const object = await generateObjectWithRetry({
		// model,
		schema,
		// prompt: promptForMarkdown + target,
		model: modelForMarkdown,
		prompt: target,
	})

	return object
}


// const testObject_markdown = {
// 	language: 'en',
// 	targetMessages: {
// 		'1': {
// 			ko: '안녕하세요, 세상!',
// 			explanation: '간단한 인사말입니다.',
// 		},
// 		'2': {
// 			ko: '이것은 **굵은** 텍스트입니다.',
// 			explanation: '마크다운 굵은 스타일이 포함된 텍스트입니다.',
// 		},
// 	},
// 	olderMessages: [],
// 	dictionary: {
// 		세상: 'world',
// 	},
// }
// const result_markdown = await generateTranslation_markdown(testObject_markdown.language, testObject_markdown.targetMessages, testObject_markdown.olderMessages, testObject_markdown.dictionary)
// console.log('💬 result_markdown:', JSON.stringify(result_markdown))

// const testObject_paraglide = {
// 	language: 'en',
// 	targetMessages: {
// 		'1': {
// 			ko: '하나의 아이템',
// 			explanation: '단수 아이템',
// 		},
// 		'2': {
// 			ko: '{count}개의 아이템',
// 			explanation: 'count 파라미터를 포함한 아이템 개수 표시',
// 		},
// 		'3': {
// 			ko: '{userName}님, 환영합니다!',
// 			explanation: '사용자 환영 메시지',
// 		},
// 	},
// 	olderMessages: [],
// 	dictionary: {
// 		아이템: 'item',
// 	},
// }
// const result_paraglide = await generateTranslation_paraglide(testObject_paraglide.language, testObject_paraglide.targetMessages, testObject_paraglide.olderMessages, testObject_paraglide.dictionary)
// console.log('💬 result_paraglide:', JSON.stringify(result_paraglide))



export const getTranslatedMessages_paraglide = async (language, targetMessages, olderMessages, dictionary) => {
	const result = await generateTranslation_paraglide(language, targetMessages, olderMessages, dictionary)

	return R.pick('translatedMessages, newDictionary')(result)
}

export const getTranslatedMessages_markdown = async (language, targetMessages, olderMessages, dictionary) => {
	const result = await generateTranslation_markdown(language, targetMessages, olderMessages, dictionary)

	return R.pick('translatedMessages, newDictionary')(result)
}
