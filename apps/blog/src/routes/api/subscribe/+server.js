import { supabase_admin } from '@library/backends/supabase_admin'
import { R } from '@library/helpers/R'
import { emailSchema } from '@library/helpers/zod-schemas'
import { getLocale } from '@library/paraglide/helpers'
import { json } from '@sveltejs/kit'

import { URL } from '$lib/info.js'
import { getOneMarkdownBody } from '$lib/markdown-helpers/getMarkdown.js'
import { getAllMetadataObject } from '$lib/markdown-helpers/getMetadata.js'
import { sendMails_immediate_action } from '$lib/wrappers/sendMails.js'

import { shuffleArray } from '@library/helpers/random'

const urlPost = `https://${URL}/posts/`

async function addSubscription_action(myEmail) {
	const { error } = await supabase_admin
		.from('blog-subscribers')
		.upsert({ email: myEmail, locale: getLocale(), subscribed: true }, { onConflict: 'email' })

	if (error) {
		throw error
	}

	return true
}

export const POST = async ({ request }) => {
	const formData = await request.formData()
	const email = formData.get('email')
	const validation = emailSchema.safeParse(email)

	if (!validation.success) {
		return json(
			{
				email,
				error: true,
			},
			{ status: 400 },
		)
	}

	try {
		await Promise.all([
			addSubscription_action(email),
			(async () => {
				const markdown = await getOneMarkdownBody('welcome')
				if (!markdown) {
					throw new Error('markdown not found')
				}

				const allMetadataObject = await getAllMetadataObject()
				const markdownMetadata_pinned = R.applyPipe(
					allMetadataObject,
					Object.values,
					R.filter(R.prop('pinned')),
					shuffleArray,
				)
				const markdownLinks = markdownMetadata_pinned.map((item) => {
					return `- [${item.title}](${urlPost}${item.slug})`
				})
				const markdownLinksString = markdownLinks.join('\n')
				const meanwhileLinksString =
					markdownLinksString ?
						`## Meanwhile, you can read:

${markdownLinksString}`
					:	''

				const sendText =
					meanwhileLinksString ?
						`${markdown.body}

${meanwhileLinksString}`
					:	markdown.body

				await sendMails_immediate_action({ markdownText: sendText, mermaidSVGObject: {} }, [
					String(email),
				])
			})(),
		])
		return json({ email }, { headers: { 'content-type': 'application/json' }, status: 200 })
	} catch (error) {
		console.error(error)
		return json(
			{
				email,
				error: true,
			},
			{ status: 500 },
		)
	}
}
