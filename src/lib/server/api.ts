import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { fileRoutes } from './routes/file';

export const api = new Elysia({ prefix: '/api' }).use(openapi()).use(fileRoutes);
