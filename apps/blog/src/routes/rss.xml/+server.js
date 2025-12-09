import { getDescriptionFromMD } from '@library/helpers/markdown'
import { R } from '@library/helpers/R'
import { getEmailHTMLFromMarkdownText_onlyContent } from '@library/library-top/getEmailHTMLFromMarkdownText'
import { replaceImageTag } from '@library/library-top/replaceImageTag'
import { getLocale } from '@library/paraglide/helpers'
import { Feed } from 'feed'

import { EMAIL, EMAIL_SENDER_NAME, URL } from '$lib/info.js'
import { getOneMarkdownBody } from '$lib/wrappers/markdown/getMarkdown'
import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata'

export async function GET() {
	const httpsURL = `https://${URL}`
	const locale = getLocale()
	console.log('💬 ~ GET ~ locale:', locale)
	const httpsURLWithLocale = `https://${URL}/${locale}`

	const getPostURLFromSlug = (slug) => {
		return `${httpsURL}/posts/${slug}`
	}
	const fixLink = (string) =>
		string
			.replaceAll('href="/', `href="${httpsURLWithLocale}/`)
			.replaceAll('src="/', `src="${httpsURLWithLocale}/`)

	const metadataObject_all = await getAllMetadataObject()
	console.log('💬 ~ GET ~ metadataObject_all:', metadataObject_all)
	const metadataArray_all = R.applyPipe(
		metadataObject_all,
		Object.values,
		R.sort(R.descend(R.prop('date'))),
	)
	const description = metadataArray_all
		.filter((item) => item.pinned)
		.map((item) => item.title)
		.join(' / ')
	const metadataArray_recent = metadataArray_all.slice(0, 15)
	const postObjectArray_recent = await Promise.all(
		metadataArray_recent.map(async (metadata) => {
			const postObject = await getOneMarkdownBody(metadata.slug)
			if (!postObject) return

			const markdownText_preprocessed = replaceImageTag(postObject.body)
			const html = fixLink(getEmailHTMLFromMarkdownText_onlyContent(markdownText_preprocessed))

			return {
				body: postObject.body,
				date: metadata.date,
				description: getDescriptionFromMD(postObject.body),
				html,
				link: getPostURLFromSlug(metadata.slug),
				slug: metadata.slug,
				title: metadata.title,
			}
		}),
	)
	const postObjectArray_recent_filtered = postObjectArray_recent.filter(
		(postObject) => !!postObject,
	)

	const feed = new Feed({
		author: {
			email: EMAIL,
			link: httpsURL,
			name: EMAIL_SENDER_NAME,
		},
		copyright: `Copyright ${new Date().getFullYear().toString()}, ${EMAIL_SENDER_NAME}`,
		description: description,
		favicon: `${httpsURL}/favicon.png`,
		feedLinks: {
			rss: `${httpsURLWithLocale}/rss.xml`,
		},
		id: httpsURLWithLocale,
		language: locale,
		link: httpsURLWithLocale,
		title: URL,
		updated: metadataArray_recent.length > 0 ? new Date(metadataArray_recent[0].date) : new Date(),
	})

	for (const postObject of postObjectArray_recent_filtered) {
		feed.addItem({
			author: [
				{
					email: EMAIL,
					link: httpsURL,
					name: EMAIL_SENDER_NAME,
				},
			],
			content: postObject.html,
			date: new Date(postObject.date),
			description: postObject.description,
			link: postObject.link,
			title: postObject.title,
		})
	}

	return new Response(feed.rss2(), {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}
