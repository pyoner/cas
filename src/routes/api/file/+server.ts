import { json, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

async function computeHash(buffer: ArrayBuffer): Promise<string> {
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const HEAD: RequestHandler = async ({ url, platform }) => {
	const hash = url.searchParams.get('hash');

	if (!hash) {
		return json({ error: 'Missing hash parameter' }, { status: 400 });
	}

	const existing = await platform?.env.BUCKET.head(hash);

	if (!existing) {
		return new Response(null, { status: 404 });
	}

	return new Response(null, {
		status: 200,
		headers: {
			'Content-Type': existing.httpMetadata?.contentType || 'application/octet-stream',
			'Content-Length': existing.size?.toString() || '',
			'X-Filename': existing.customMetadata?.originalFilename || ''
		}
	});
};

export const GET: RequestHandler = async ({ url, platform }) => {
	const hash = url.searchParams.get('hash');

	if (!hash) {
		return json({ error: 'Missing hash parameter' }, { status: 400 });
	}

	const object = await platform?.env.BUCKET.get(hash);

	if (!object) {
		return json({ error: 'File not found' }, { status: 404 });
	}

	if (dev) {
		const headers = new Headers();
		headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
		headers.set('Content-Length', object.size.toString());
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');

		return new Response(object.body, {
			status: 200,
			headers
		});
	}

	const r2Url = (platform?.env as { R2_URL?: string }).R2_URL;
	if (!r2Url) {
		return json({ error: 'R2_URL not configured' }, { status: 500 });
	}

	throw redirect(302, `${r2Url}/${hash}`);
};

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
			{
				error: 'Invalid hash: client-side hash does not match server-computed hash'
			},
			{ status: 400 }
		);
	}

	const hash = serverHash;

	const existing = await platform?.env.BUCKET.head(hash);

	if (existing) {
		return json({
			hash,
			filename,
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

	return json({
		hash,
		filename,
		existing: false
	});
};
