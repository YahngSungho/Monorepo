import { supabase_admin } from '@library/backends/supabase_admin'
import { emailSchema } from '@library/helpers/zod-schemas';
import { getLocale } from '@library/paraglide/helpers'
import { json } from '@sveltejs/kit';
import { sendMails_immediate_action } from '$lib/server/sendMails.js'
import { getOneMarkdownBody } from '../../../markdown-helpers/getMarkdown.js'

async function addSubscription_action(myEmail) {
	const { error } = await supabase_admin.from('blog-subscribers').upsert({ email: myEmail, locale: getLocale(), subscribed: true }, { onConflict: 'email' });

	if (error) {
		throw error;
	}

	return true
}

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const email = formData.get('email');
	const validation = emailSchema.safeParse(email);

	if (!validation.success) {
		return json({
			email,
			error: true,
		}, { status: 400 });
	}

	try {
		await Promise.all([
			addSubscription_action(email),
			(async () => {
				const markdown = await getOneMarkdownBody('welcome');
				if (!markdown) {
					throw new Error('markdown not found');
				}
				await sendMails_immediate_action({ mermaidSVGObject: {}, markdownText: markdown.body }, [String(email)]);
			})(),
		])
		return json({ email },
			{ headers: { 'content-type': 'application/json' }, status: 200 },
		);
	} catch (error) {
		console.error(error);
		return json({
			email,
			error: true,
		}, { status: 500 });
	}
};
