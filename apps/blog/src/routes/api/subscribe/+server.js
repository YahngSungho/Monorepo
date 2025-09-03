import { json } from '@sveltejs/kit';
import { emailSchema } from '@library/helpers/zod-schemas';

async function addEmail_forTest(myEmail) {
	await new Promise((resolve) => {
		setTimeout(resolve, 2000)
		console.log(`[DB] ${myEmail} 주소가 추가되었습니다.`);
	})
	return true;
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
		await addEmail_forTest(email);
		return json({ email },
			{ status: 200, headers: { 'content-type': 'application/json' } },
		);
	} catch (error) {
		console.error(error);
		return json({
			email,
			error: true,
		}, { status: 500 });
	}
};
