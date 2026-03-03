import type { Handle } from '@sveltejs/kit';
import { handleApi } from '$lib/server/api';

export const handle: Handle = handleApi;
