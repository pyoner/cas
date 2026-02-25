import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

async function computeHash(buffer: ArrayBuffer): Promise<string> {
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const formData = await request.formData();

	const file = formData.get('file') as File | null;
	const clientHash = formData.get('hash') as string | null;
	const filename = formData.get('filename') as string | null;
	const contentType = formData.get('contentType') as string | null;

	if (!file || !filename || !contentType) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	if (file.size > MAX_FILE_SIZE) {
		return json({ error: 'File too large. Maximum size is 100MB' }, { status: 400 });
	}

	const buffer = await file.arrayBuffer();
	const serverHash = await computeHash(buffer);

	if (clientHash && clientHash !== serverHash) {
		return json(
			{ error: 'Invalid hash: client-side hash does not match server-computed hash' },
			{ status: 400 }
		);
	}

	const hash = serverHash;

	const existing = await platform?.env.BUCKET.head(hash);

	if (existing) {
		const url = `https://pub-${hash}.r2.dev/${hash}`;
		return json({
			url,
			hash,
			filename,
			contentType,
			existing: true
		});
	}

	await platform?.env.BUCKET.put(hash, buffer, {
		httpMetadata: {
			contentType
		},
		customMetadata: {
			originalFilename: filename
		}
	});

	const url = `https://pub-${hash}.r2.dev/${hash}`;

	return json({
		url,
		hash,
		filename,
		contentType,
		existing: false
	});
};
