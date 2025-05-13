import { GoogleGenAI } from '@google/genai'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'development') {
	config({ path: '../../../../.env' })
}

export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
