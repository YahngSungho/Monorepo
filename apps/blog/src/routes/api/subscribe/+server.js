import { supabase_admin } from '@library/backends/supabase_admin'
import { R } from '@library/helpers/R'
import { shuffleArray } from '@library/helpers/random'
import { emailSchema } from '@library/helpers/zod-schemas'
import { getLocale } from '@library/paraglide/helpers'
import { json } from '@sveltejs/kit'

import { URL } from '$lib/info.js'
import { getOneMarkdownBody } from '$lib/wrappers/markdown/getMarkdown.js'
import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata.js'
import { sendMails_immediate_action } from '$lib/wrappers/sendMails.js'

const urlPost = `https://${URL}/posts/`

async function addSubscription_action(email) {
	const { error: error1 } = await supabase_admin
		.from('user-information')
		.upsert({ email: email, locale: getLocale() }, { onConflict: 'email' })
	if (error1) {
		throw error1
	}

	const { error: error2 } = await supabase_admin.from('user-activity').upsert(
		[
			{ activity_type: 'visited', email: email, project_name: '@app/blog' },
			{ activity_type: 'subscribed', email: email, project_name: '@app/blog' },
		],
		{
			ignoreDuplicates: true,
			onConflict: 'email, project_name, activity_type',
		},
	)
	if (error2) {
		throw error2
	}

	return true
}

const WELCOME_SLUG = 'welcome'

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
				const markdown = await getOneMarkdownBody(WELCOME_SLUG)
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

				await sendMails_immediate_action({ campaignID: WELCOME_SLUG, markdownText: sendText }, [
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
