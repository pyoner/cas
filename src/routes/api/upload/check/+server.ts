import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform }) => {
	const hash = url.searchParams.get('hash');

	if (!hash) {
		return json({ error: 'Missing hash parameter' }, { status: 400 });
	}

	const existing = await platform?.env.BUCKET.head(hash);

	if (existing) {
		return json({
			exists: true,
			hash,
			filename: existing.customMetadata?.originalFilename,
			contentType: existing.httpMetadata?.contentType
		});
	}

	return json({ exists: false, hash });
};
