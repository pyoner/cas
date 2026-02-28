import { Elysia } from 'elysia';

export const requestPlatformMap = new WeakMap<Request, App.Platform>();

export const platformPlugin = new Elysia({ name: 'context' }).derive(
	{ as: 'scoped' },
	({ request }) => {
		const platform = requestPlatformMap.get(request);
		return { platform };
	}
);
