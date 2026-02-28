import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { fileRoutes } from './routes/file';
import { platformPlugin } from './platform';

export const api = new Elysia({ prefix: '/api' })
	.use(openapi())
	.use(platformPlugin)
	.use(fileRoutes);
