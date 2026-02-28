import { Elysia } from 'elysia';

export const requestPlatformMap = new WeakMap<Request, App.Platform>();

export const platformPlugin = new Elysia({ name: 'context' }).derive(
	{ as: 'scoped' },
	({ request, status }) => {
		const platform = requestPlatformMap.get(request);
		if (!platform) {
			return status(500, 'Platform context not found');
		}
		return { platform };
	}
);
