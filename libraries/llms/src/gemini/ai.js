import { GoogleGenAI } from '@google/genai'
import { config } from 'dotenv'

config({ path: '../../../../.env' })
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
