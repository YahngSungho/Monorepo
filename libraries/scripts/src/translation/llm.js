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
console.log('💬 modelForParaglide:', modelForParaglide)
const modelForMarkdown = await getTheModel(promptForMarkdown)
console.log('💬 modelForMarkdown:', modelForMarkdown)

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


const testObject_markdown = {
	language: 'en',
	targetMessages: {
		'1': {
			ko: '안녕하세요, 세상!',
			explanation: '간단한 인사말입니다.',
		},
		'2': {
			ko: '이것은 **굵은** 텍스트입니다.',
			explanation: '마크다운 굵은 스타일이 포함된 텍스트입니다.',
		},
		'3': {
			ko: '---\ntitle: 한국어 제목\ntags: 태그1, 태그2\n---\n# 문서 제목\n\n다음은 주요 항목입니다:\n\n1. 첫 번째 항목은 `중요합니다`.\n2. 두 번째 항목은 [예제 링크](https://example.com)를 포함합니다.\n    * 중첩 항목 1\n    * 중첩 항목 2\n3. 세 번째 항목.',
			explanation: 'YAML 앞표지, 헤더, 목록, 인라인 코드, 링크, 중첩 목록을 포함한 복잡한 마크다운입니다.',
		},
		'4': {
			ko: '### 프로세스 흐름도\n\n<Mermaid>\ngraph TD\n    A["시작 지점"] --> B("중간 단계");\n    B --> C{"결정 지점"};\n    C -- "예" --> D["성공 경로"];\n    C -- "아니요" --> E["실패 경로"];\n</Mermaid>\n\n위 다이어그램은 전체 프로세스를 요약합니다. `핵심 로직`은 B와 C에 있습니다.',
			explanation: 'Mermaid 다이어그램과 주변 텍스트, 그리고 인라인 코드를 포함합니다. Mermaid 내부 레이블 번역을 테스트합니다.',
		},
		'5': {
			ko: '그의 제안은 마치 한여름 밤의 꿈처럼 황당무계했지만, 한편으로는 매우 기발한 구석이 있었다. 이 **프로젝트**는 `특이점`을 목표로 한다.',
			explanation: '독특한 비유와 스타일 가이드의 충실도 유지를 테스트하기 위한 문장입니다. 기술 용어를 포함합니다.',
		},
	},
	olderMessages: [
		'This is an example of an older message.',
	],
	dictionary: {
		세상: 'world',
		항목: 'item',
		프로젝트: 'project',
		특이점: 'singularity',
	},
}
const result_markdown = await generateTranslation_markdown(testObject_markdown.language, testObject_markdown.targetMessages, testObject_markdown.olderMessages, testObject_markdown.dictionary)
console.log('💬 result_markdown:', result_markdown)

const testObject_paraglide = {
	language: 'en',
	targetMessages: {
		'1': {
			ko: '하나의 아이템',
			explanation: '단수 아이템',
		},
		'2': {
			ko: '{count}개의 아이템',
			explanation: 'count 파라미터를 포함한 아이템 개수 표시. 영어 번역 시 복수형 처리가 필요합니다.',
		},
		'3': {
			ko: '{userName}님, 환영합니다!',
			explanation: '사용자 환영 메시지',
		},
		'4': {
			ko: '{documentCount}개의 문서가 있습니다.',
			explanation: '문서 개수를 나타내며, documentCount 파라미터는 숫자입니다. 영어 번역 시 선제적 복수화가 필요합니다.',
		},
		'5': {
			ko: '{userName}님, 안녕하세요. 성별이 {gender}이시군요.',
			explanation: "성별(gender)에 따라 다른 메시지를 표시할 수 있는 Paraglide의 'matching' 기능을 테스트하기 위한 메시지입니다. (예: gender='male'/'female'/'other')",
		},
		'6': {
			ko: "'{fileName}' 파일을 '{folderName}' 폴더로 성공적으로 이동했습니다.",
			explanation: '여러 매개변수를 포함하는 일반적인 UI 알림 메시지입니다.',
		},
	},
	olderMessages: [
		'Hello, {name}!',
	],
	dictionary: {
		아이템: 'item',
		문서: 'document',
		파일: 'file',
		폴더: 'folder',
	},
}
const result_paraglide = await generateTranslation_paraglide(testObject_paraglide.language, testObject_paraglide.targetMessages, testObject_paraglide.olderMessages, testObject_paraglide.dictionary)
console.log('💬 result_paraglide:', result_paraglide)
console.log('💬 result_paraglide:', JSON.stringify(result_paraglide, undefined, 2))



export const getTranslatedMessages_paraglide = async (language, targetMessages, olderMessages, dictionary) => {
	const result = await generateTranslation_paraglide(language, targetMessages, olderMessages, dictionary)

	return R.pick('translatedMessages, newDictionary')(result)
}

export const getTranslatedMessages_markdown = async (language, targetMessages, olderMessages, dictionary) => {
	const result = await generateTranslation_markdown(language, targetMessages, olderMessages, dictionary)

	return R.pick('translatedMessages, newDictionary')(result)
}
