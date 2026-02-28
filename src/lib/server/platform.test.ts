import { test, expect, describe } from 'bun:test';
import { Elysia } from 'elysia';
import { platformPlugin, requestPlatformMap } from './platform';

describe('Elysia .derive behavior', () => {
	test('returning status from derive HALTS execution and returns the error', async () => {
		const app = new Elysia()
			.derive(({ status }) => {
				// Returning the status instead of throwing
				return status(500, 'Something went wrong');
			})
			.get('/', () => {
				// We should NEVER reach this handler if we return a Response from derive
				return 'I should not be reached';
			});

		const req = new Request('http://localhost/');
		const res = await app.handle(req);

		expect(res.status).toBe(500);
		expect(await res.text()).toBe('Something went wrong');
	});

	test('throwing status from derive HALTS execution and returns the error', async () => {
		const app = new Elysia()
			.derive(({ status }) => {
				// Throwing the status
				throw status(500, 'Something went wrong');
			})
			.get('/', () => {
				// We should NEVER reach this handler
				return 'I should not be reached';
			});

		const req = new Request('http://localhost/');
		const res = await app.handle(req);

		expect(res.status).toBe(500);
		expect(await res.text()).toBe('Something went wrong');
	});
});

describe('platformPlugin', () => {
	test('returns 500 if platform is not in weakmap', async () => {
		const app = new Elysia().use(platformPlugin).get('/', ({ platform }) => {
			return 'success';
		});

		const req = new Request('http://localhost/');
		const res = await app.handle(req);

		expect(res.status).toBe(500);
		expect(await res.text()).toBe('Platform context not found');
	});

	test('successfully injects platform if present in weakmap', async () => {
		const mockPlatform = {
			env: {
				BUCKET: {
					get: () => 'mock data'
				}
			}
		} as unknown as App.Platform;

		const app = new Elysia().use(platformPlugin).get('/', ({ platform }) => {
			return 'success';
		});

		const req = new Request('http://localhost/');
		requestPlatformMap.set(req, mockPlatform);

		const res = await app.handle(req);

		expect(res.status).toBe(200);
		expect(await res.text()).toBe('success');
	});
});
