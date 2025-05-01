import { generateText } from 'ai'

import { generateWithRetry_atQuotaLimit } from '../heleprs.js'

// 어떻게든 Cache를 사용할 수 있게 만들기 위해서 object 검증은 여기서 수동으로 한다
export const generateObjectWithRetry = async ({model, schema, prompt}) => {
	const addedPrompt = `${prompt}

--- IMPORTANT RULES FOR YOUR RESPONSE ---
1. Your *entire* response MUST start *exactly* with the line \`\`\`json on the very first line. No characters or spaces before it.
2. Your *entire* response MUST end *exactly* with the line \`\`\` on the very last line. No characters or spaces after it.
3. The content *between* the first (\`\`\`json) and last (\`\`\`) lines MUST be a single, valid JSON object string.
4. This JSON object MUST strictly adhere to the schema described earlier in the prompt.
5. Do NOT include *any* other text, explanations, apologies, or conversational elements outside the \`\`\`json and \`\`\` markers. Only the JSON object wrapped in the markdown code block.

<Your_Response>
The first line of your output must be '\`\`\`json'. The last line must be '\`\`\`'. This means the actual JSON object string content is from the second line to the second-to-last line. The text remaining after removing the first and last lines from your response must be directly parsable by \`JSON.parse\`.
</Your_Response>
`;

	const { text } =  await generateWithRetry_atQuotaLimit(generateText, 3, 60, { model, prompt: addedPrompt })

	try {
		let jsonContent = '';
		const startIndex = text.indexOf('```json\n');
		const endIndex = text.lastIndexOf('\n```');

		if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
			jsonContent = text.slice(startIndex + '```json\n'.length, endIndex).trim();
		} else {
			console.warn(
				'Could not find ```json ... ``` block as expected, attempting fallback extraction by slicing lines. Raw text:',
				text
			);
			const lines = text.split('\n');
			jsonContent = lines.slice(1, -1).join('\n').trim();
		}

		if (!jsonContent) {
			console.error('Failed to extract JSON content from LLM response. Raw text:', text);
			throw new Error('LLM response did not contain extractable JSON content.');
		}

		const parsedObject = JSON.parse(jsonContent)

		try {
			schema.parse(parsedObject)
			return parsedObject // Return only on successful parsing and validation
		} catch (validationError) {
			console.error('Schema validation failed:', validationError);
			console.error('Invalid object received:', parsedObject);
			// Handle validation error (e.g., throw, return null, retry with feedback)
			throw new Error('LLM output failed schema validation');
		}
	} catch (parseError) {
		console.error('JSON parsing failed:', parseError);
		console.error('Raw text received:', text);
		// Handle parsing error (e.g., throw, return null, retry)
		throw new Error('LLM output was not valid JSON or could not be extracted.');
	}
}