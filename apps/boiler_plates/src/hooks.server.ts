import type {Handle} from '@sveltejs/kit'
import {i18n} from '@repo/base/i18n.ts'

const handleParaglide: Handle = i18n.handle()
export const handle: Handle = handleParaglide
