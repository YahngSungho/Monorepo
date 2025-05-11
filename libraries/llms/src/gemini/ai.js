import { GoogleGenAI } from '@google/genai'
import { config } from 'dotenv'

config({ path: '../../../../.env' })
export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
