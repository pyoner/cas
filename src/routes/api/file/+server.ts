import { dev } from '$app/environment';
import { computeHash, MAX_FILE_SIZE } from '$lib/hash';
import type { UploadResult } from '$lib/types';
import type { RequestHandler } from './$types';
import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api/file' })
	.derive(({ request }) => {
		// Type casting request to access the platform object injected in fallback
		const platform = (request as any).platform as App.Platform;
		return { platform };
	})
	.head(
		'/',
		async ({ query, platform, status }) => {
			const hash = query.hash;
			const existing = await platform?.env.BUCKET.head(hash);

			if (!existing) {
				return status(404);
			}

			const headers = new Headers();
			headers.set('Content-Type', existing.httpMetadata?.contentType || 'application/octet-stream');
			headers.set('Content-Length', existing.size.toString());
			headers.set('X-Filename', existing.customMetadata?.originalFilename || '');

			return new Response(null, { status: 200, headers });
		},
		{
			query: t.Object({
				hash: t.String({ error: 'Missing hash parameter' })
			})
		}
	)
	.get(
		'/',
		async ({ query, platform, status, redirect }) => {
			const hash = query.hash;
			const object = await platform?.env.BUCKET.get(hash);

			if (!object) {
				return status(404, { error: 'File not found' });
			}

			if (dev) {
				const headers = new Headers();
				headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
				headers.set('Content-Length', object.size.toString());
				headers.set('Cache-Control', 'public, max-age=31536000, immutable');

				return new Response(object.body as unknown as BodyInit, {
					status: 200,
					headers
				});
			}

			const r2Url = (platform?.env as { R2_URL?: string }).R2_URL;
			if (!r2Url) {
				return status(500, { error: 'R2_URL not configured' });
			}

			throw redirect(`${r2Url}/${hash}`, 302);
		},
		{
			query: t.Object({
				hash: t.String({ error: 'Missing hash parameter' })
			})
		}
	)
	.post(
		'/',
		async ({ body, platform, status }) => {
			const file = body.file;
			const clientHash = body.hash;
			const filename = body.filename;
			const contentType = body.contentType;

			if (file.size > MAX_FILE_SIZE) {
				return status(400, { error: 'File too large. Maximum size is 100MB' });
			}

			const buffer = await file.arrayBuffer();
			const serverHash = await computeHash(buffer);

			if (clientHash && clientHash !== serverHash) {
				return status(400, {
					error: 'Invalid hash: client-side hash does not match server-computed hash'
				});
			}

			const hash = serverHash;
			const existing = await platform?.env.BUCKET.head(hash);

			if (existing) {
				return { hash, filename, existing: true } satisfies UploadResult;
			}

			await platform?.env.BUCKET.put(hash, buffer, {
				httpMetadata: { contentType },
				customMetadata: { originalFilename: filename }
			});

			return { hash, filename, existing: false } satisfies UploadResult;
		},
		{
			body: t.Object(
				{
					file: t.File(),
					hash: t.Optional(t.String()),
					filename: t.String(),
					contentType: t.String()
				},
				{ error: 'Missing required fields' }
			)
		}
	);

export const fallback: RequestHandler = ({ request, platform }) => {
	(request as any).platform = platform;
	return app.handle(request);
};
