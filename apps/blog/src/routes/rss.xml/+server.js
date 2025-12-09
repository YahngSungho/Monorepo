import { Feed } from 'feed';
import { EMAIL_SENDER_NAME, URL, EMAIL } from '$lib/info.js'
import { getLocale } from '@library/paraglide/helpers'
import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata'
import { getDescriptionFromMD } from '@library/helpers/markdown'
import { getOneMarkdownBody } from '$lib/wrappers/markdown/getMarkdown'
import { replaceImageTag } from '@library/library-top/replaceImageTag'
import { getEmailHTMLFromMarkdownText_onlyContent } from '@library/library-top/getEmailHTMLFromMarkdownText'
import { R } from '@library/helpers/R'


export async function GET() {
	const httpsURL = `https://${URL}`
	const locale = getLocale()
	console.log('💬 ~ GET ~ locale:', locale)
	const httpsURLWithLocale = `https://${URL}/${locale}`

	const getPostURLFromSlug = (slug) => {
		return `${httpsURL}/posts/${slug}`
	}
	const fixLink = (string) => string.replaceAll('href="/', `href="${httpsURLWithLocale}/`).replaceAll('src="/', `src="${httpsURLWithLocale}/`)

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
	const postObjectArray_recent = await Promise.all(metadataArray_recent.map(async (metadata) => {
		const postObject = await getOneMarkdownBody(metadata.slug)
		if (!postObject) return

		const markdownText_preprocessed = replaceImageTag(postObject.body)
		const html = fixLink(getEmailHTMLFromMarkdownText_onlyContent(markdownText_preprocessed))


		return {
			body: postObject.body,
			description: getDescriptionFromMD(postObject.body),
			slug: metadata.slug,
			link: getPostURLFromSlug(metadata.slug),
			date: metadata.date,
			title: metadata.title,
			html,
		}
	}))
	const postObjectArray_recent_filtered = postObjectArray_recent.filter((postObject) => !!postObject)


	const feed = new Feed({
		title: URL,
		id: httpsURLWithLocale,
		link: httpsURLWithLocale,
		description: description,
		language: locale,
		favicon: `${httpsURL}/favicon.png`,
		copyright: `Copyright ${new Date().getFullYear().toString()}, ${EMAIL_SENDER_NAME}`,
		feedLinks: {
			rss: `${httpsURLWithLocale}/rss.xml`,
		},
		author: {
			name: EMAIL_SENDER_NAME,
			email: EMAIL,
			link: httpsURL,
		},
		updated: metadataArray_recent.length > 0
    ? new Date(metadataArray_recent[0].date)
    : new Date(),
	});


	for (const postObject of postObjectArray_recent_filtered) {
		feed.addItem({
			title: postObject.title,
			description: postObject.description,
			content: postObject.html,
			link: postObject.link,
			author: [
				{
					name: EMAIL_SENDER_NAME,
					email: EMAIL,
					link: httpsURL,
				},
			],
			date: new Date(postObject.date),
		});
	}

	return new Response(feed.rss2(), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		},
	});
}