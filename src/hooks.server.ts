import type { Handle } from '@sveltejs/kit';
import { api, requestPlatformMap } from '$lib/server/api';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		if (event.platform) {
			requestPlatformMap.set(event.request, event.platform);
		}
		return api.handle(event.request);
	}

	return resolve(event);
};
