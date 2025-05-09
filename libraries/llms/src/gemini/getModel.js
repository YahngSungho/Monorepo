import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createUserContent,GoogleGenAI } from '@google/genai'
import { R } from '@library/helpers/R'
import { config } from 'dotenv'
// import { GoogleAICacheManager } from '@google/generative-ai/server'

config({ path: '../../../../.env' })

const createCleanModel = createGoogleGenerativeAI({
	  fetch: async (input, init) => {
    const request = new Request(input, init);
    const {headers} = request;
    const contentType = headers.get("content-type");

    // Check if it's a JSON request likely targeting the generateContent endpoint
    if (contentType?.includes("application/json")) {
      // Clone the request to read the body safely
      const clonedRequest = request.clone();
      try {
        const body = await clonedRequest.json();

        // If cachedContent is present, remove fields disallowed by the API
        if (body?.cachedContent) {
          delete body.tools;
          delete body.toolConfig;
          delete body.systemInstruction;

          // Create a new init object with the modified body
          const newInit = {
            ...init,
            body: JSON.stringify(body), // Reserialize the modified body
          };
          // Fetch with the modified init object
          return fetch(input, newInit);
        }
      } catch (error) {
        console.error("Error processing request body:", error);
        // Proceed with the original request if JSON parsing fails or it's not the expected structure
      }
    }
    // Fallback to the original fetch call
    return fetch(input, init);
  },
})

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
// const cacheManager = new GoogleAICacheManager(process.env.GEMINI_API_KEY || '')

export const getCachedModel = R.curry(async (modelName, options, willBeCachedData) => {
// export const getCachedModel = R.curry(async (modelName, options) => {
	const { name: cacheName } = await ai.caches.create({
		model: modelName,
		config: {
			contents: createUserContent(willBeCachedData),
			ttl: `${60 * 30}s`
		},
	})
	// const { name: cacheName } = await cacheManager.create({
	// 	model: modelName,
	// 	contents: [{
	// 		role: 'user',
	// 		parts: [{
	// 			text: willBeCachedData
	// 		}]
	// 	}],
	// 	ttlSeconds: 60 * 30

	// })

	return createCleanModel(modelName, {
		...options,
		cachedContent: cacheName,
				topP: 0.2,
						providerOptions: {
			google: {
				responseMimeType: 'application/json',
				thinkingConfig: {
					includeThoughts: false, thinkingBudget: 5000
				}
			}
		},
	})
})