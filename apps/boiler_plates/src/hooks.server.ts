import type {Handle} from '@sveltejs/kit'
import {i18n} from '@repo/base/i18n.ts'

const handleParaglide: Handle = i18n.handle({
	disableAsyncLocalStorage: true, // Serverless 사용한다고 가정
})
export const handle: Handle = handleParaglide
